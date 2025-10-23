from machine import Pin, SPI
from mfrx	522 import MFRC522
from time import sleep_ms, ticks_ms, ticks_diff
import network
import urequests
import gc

# =============================
# WIFI SETUP
# =============================
SSID = "imp { Wifi } from internet"
PASSWORD = "rio@0912"

def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(SSID, PASSWORD)
    print("Connecting to Wi-Fi...", end="")
    while not wlan.isconnected():
        sleep_ms(500)
        print(".", end="")
    print("\nConnected:", wlan.ifconfig())

connect_wifi()

# =============================
# LCD DRIVER
# =============================
class LcdApi:
    def __init__(self, num_lines, num_columns):
        self.num_lines = num_lines
        self.num_columns = num_columns
        self.cursor_x = 0
        self.cursor_y = 0

    def clear(self):
        self.hal_write_command(0x01)
        sleep_ms(2)
        self.cursor_x = 0
        self.cursor_y = 0

    def move_to(self, x, y):
        self.cursor_x = x
        self.cursor_y = y
        addr = 0x80 | (y * 0x40 + x)
        self.hal_write_command(addr)

    def putstr(self, string):
        for char in string:
            if char == '\n':
                self.cursor_y += 1
                self.cursor_x = 0
                self.move_to(self.cursor_x, self.cursor_y)
            else:
                self.hal_write_data(ord(char))
                self.cursor_x += 1

class GpioLcd(LcdApi):
    def __init__(self, rs_pin, enable_pin, d4_pin, d5_pin, d6_pin, d7_pin, num_lines=2, num_columns=16):
        self.rs = Pin(rs_pin, Pin.OUT)
        self.enable = Pin(enable_pin, Pin.OUT)
        self.data_pins = [Pin(p, Pin.OUT) for p in (d4_pin, d5_pin, d6_pin, d7_pin)]
        super().__init__(num_lines, num_columns)
        self.init_lcd()

    def pulse_enable(self):
        self.enable.value(0)
        sleep_ms(1)
        self.enable.value(1)
        sleep_ms(1)
        self.enable.value(0)
        sleep_ms(1)

    def send_nibble(self, nibble):
        for i in range(4):
            self.data_pins[i].value((nibble >> i) & 0x01)
        self.pulse_enable()

    def hal_write_command(self, cmd):
        self.rs.value(0)
        self.send_nibble(cmd >> 4)
        self.send_nibble(cmd & 0x0F)
        if cmd <= 3:
            sleep_ms(5)

    def hal_write_data(self, data):
        self.rs.value(1)
        self.send_nibble(data >> 4)
        self.send_nibble(data & 0x0F)

    def init_lcd(self):
        sleep_ms(50)
        self.rs.value(0)
        self.send_nibble(0x03)
        sleep_ms(5)
        self.send_nibble(0x03)
        sleep_ms(5)
        self.send_nibble(0x03)
        sleep_ms(1)
        self.send_nibble(0x02)
        self.hal_write_command(0x28)
        self.hal_write_command(0x0C)
        self.hal_write_command(0x06)
        self.clear()

# =============================
# RFID SETUP
# =============================
sck = 19
mosi = 23
miso = 25
cs = 22
rst = 21

spi = SPI(1, baudrate=2000000, polarity=0, phase=0,
          sck=Pin(sck), mosi=Pin(mosi), miso=Pin(miso))
rfid = MFRC522(spi=spi, gpioRst=Pin(rst), gpioCs=Pin(cs))

# =============================
# LCD SETUP
# =============================
lcd = GpioLcd(rs_pin=13, enable_pin=12, d4_pin=14, d5_pin=27, d6_pin=26, d7_pin=33)

def lcd_show(msg):
    lcd.clear()
    lcd.putstr(msg)

lcd_show("Good Morning!")
print("System Ready - Scan your card")

# =============================
# MAIN LOOP
# =============================
UID_DISPLAY_MS = 3000  # display UID for 3 seconds
last_uid_time = 0
current_uid = None

def send_card_data(uid):
    try:
        response = urequests.post("http://192.168.0.107:3002/data",
                                 json={"card_id": uid},
                                 headers={"Content-Type": "application/json"})
        print("Data sent:", response.text)
        response.close()
    except Exception as e:
        print("Failed to send:", e)
    finally:
        gc.collect()

while True:
    stat, tag_type = rfid.request(rfid.REQIDL)
    if stat == rfid.OK:
        stat, uid = rfid.anticoll()
        if stat == rfid.OK:
            uid_str = "".join("{:02X}".format(x) for x in uid)
            print("Card detected:", uid_str)
            current_uid = uid_str
            last_uid_time = ticks_ms()
            lcd_show("Card UID:\n" + uid_str)
            send_card_data(uid_str)

    # Auto-return to greeting
    if current_uid and ticks_diff(ticks_ms(), last_uid_time) > UID_DISPLAY_MS:
        lcd_show("Good Morning!")
        current_uid = None

    sleep_ms(5)  # minimal sleep for faster detection
