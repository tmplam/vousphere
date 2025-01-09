import 'package:flutter/material.dart';
import 'package:vousphere/features/event/presentation/EventPage.dart';

class HomeSearchBox extends StatelessWidget {
  HomeSearchBox({super.key});

  final FocusNode searchFocus = FocusNode();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: TextField(
            decoration: InputDecoration(
              contentPadding: const EdgeInsets.fromLTRB(0, 12, 0, 4),
              filled: true,
              fillColor: Colors.blueGrey.withOpacity(0.06),
              hoverColor: Colors.transparent,
              focusColor: Colors.white,
              hintText: 'Search...',
              hintStyle: const TextStyle(color: Colors.blueGrey),
              prefixIcon: const Icon(
                Icons.search,
                color: Colors.blueGrey,
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide.none,
              ),
              focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide(color: Colors.blue.shade700, width: 0.7)
              ),
            ),
            focusNode: searchFocus,
            onSubmitted: (value) {
                searchFocus.unfocus();
                if(value.trim().isEmpty) {
                  return;
                }
                Navigator.push(
                  context,
                  PageRouteBuilder(pageBuilder: (context, animation, secondaryAnimation) => EventPage(keyword: value,),)
                );
            },
          ),
        ),
      ],
    );
  }
}
