import 'package:flutter/material.dart';

class DateInput extends StatefulWidget {
  @override
  _DateInputState createState() => _DateInputState();
  FocusNode nameFocusNode;
  FocusNode phoneNumberFocusNode;
  TextEditingController controller;
  DateInput(this.nameFocusNode, this.phoneNumberFocusNode, this.controller, {super.key});
}

class _DateInputState extends State<DateInput> {
  final TextEditingController _controller = TextEditingController();

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1920),
      lastDate: DateTime(2030),
    );

    if (picked != null) {
      setState(() {
        widget.controller.text = picked!.toIso8601String().substring(0, 10);
      });
    }

  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        widget.nameFocusNode.unfocus();
        widget.phoneNumberFocusNode.unfocus();
        _selectDate(context);
      },
      child: AbsorbPointer(
        child: TextField(
          controller: widget.controller,
          style: const TextStyle(fontSize: 16),
          decoration: InputDecoration(
            hintText: 'YYYY-MM-DD',
            filled: true,
            fillColor: Colors.blue.shade50,
            hintStyle: const TextStyle(color: Colors.blueGrey, fontSize: 14),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none, // don't have outline when unfocus
            ),
            focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: Colors.blue.shade700, width: 0.7)
            ),
            hoverColor: Colors.transparent,
          ),
        ),
      ),
    );
  }
}
