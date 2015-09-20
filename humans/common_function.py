import datetime


def convert_datetime_to_string(o):
    DATE_FORMAT = '%Y-%m-%d'
    TIME_FORMAT = '%H:%M:%S'
    return o.strftime('%sT%s' % (DATE_FORMAT, TIME_FORMAT))


def clear_string(s):
    return s.replace('>', '').replace('<', '').replace('"', '') \
        .replace("'", '').replace('`', '').replace('=', '') \
        .replace('/', '').replace('\\', '').replace('\n', '')
