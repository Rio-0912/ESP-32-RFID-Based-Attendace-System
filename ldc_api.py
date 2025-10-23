class LcdApi:
    def __init__(self, num_lines, num_columns):
        self.num_lines = num_lines
        self.num_columns = num_columns
        self.cursor_x = 0
        self.cursor_y = 0

    def clear(self):
        self.hal_write_command(0x01)
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
