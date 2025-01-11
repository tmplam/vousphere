import 'package:intl/intl.dart';

class DateTimeUtils {
  static DateFormat format1 = DateFormat('EEEE, dd MMM yyyy HH:mm:ss');
  static DateFormat format2 = DateFormat('MMM dd');
  static DateFormat format4 = DateFormat('HH:mm');
  static DateFormat format3 = DateFormat('MMM');

  static String getMonthMMM(DateTime date) {
    return format3.format(date);
  }

  static String getFormatMMMDD(DateTime date) {
    return format2.format(date);
  }

  static String getFormatHHmm(DateTime date) {
    return format4.format(date);
  }

  static String getFullString(DateTime date) {
    return format1.format(date);
  }


}