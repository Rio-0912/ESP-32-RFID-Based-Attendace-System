from machine import Pin
from time import sleep_ms
from ldc_api import LcdApi

class GpioLcd(LcdApi):
    def __init__(self, rs_pin, enable_pin, d4_pin, d5_pin, d6_pin, d7_pin, num_lines=2, num_columns=16):
        self.rs = Pin(rs_pin, Pin.OUT)
        self.enable = Pin(enable_pin, Pin.OUT)
        self.data_pins = [Pin(d4_pin, Pin.OUT), Pin(d5_pin, Pin.OUT),
                          Pin(d6_pin, Pin.OUT), Pin(d7_pin, Pin.OUT)]
        super().__init__(num_lines, num_columns)
        self.init_lcd()

    def pulse_enable(self):
        self.enable.value(0)
        sleep_ms(1)
        self.enable.value(1)
        sleep_ms(1)
        self.enable.value(0)
        sleep_ms(1)

    def hal_write_command(self, cmd):
        self.rs.value(0)
        self.hal_write_bits(cmd)
        if cmd <= 3:
            sleep_ms(5)

    def hal_write_data(self, data):
        self.rs.value(1)
        self.hal_write_bits(data)

    def hal_write_bits(self, value):
        for i in range(4):
            self.data_pins[i].value((value >> (i + 4)) & 0x01)
        self.pulse_enable()
        for i in range(4):
            self.data_pins[i].value((value >> i) & 0x01)
        self.pulse_enable()

    def init_lcd(self):
        sleep_ms(20)
        self.hal_write_command(0x33)
        self.hal_write_command(0x32)
        self.hal_write_command(0x28)
        self.hal_write_command(0x0C)
        self.hal_write_command(0x06)
        self.clear()
