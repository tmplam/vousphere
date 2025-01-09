import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:vousphere/features/event/provider/EventProvider.dart';

class SearchBox extends StatefulWidget {
  SearchBox({super.key});

  @override
  State<SearchBox> createState() => _SearchBoxState();
}

class _SearchBoxState extends State<SearchBox> {
  final FocusNode searchFocus = FocusNode();
  final TextEditingController searchController = TextEditingController();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      searchController.text = Provider.of<EventProvider>(context, listen: false).keyword;
    });
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    searchFocus.dispose();
    searchController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    EventProvider eventProvider = Provider.of<EventProvider>(context, listen: true);

    return Row(
      children: [
        const SizedBox(width: 5,),
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
            controller: searchController,
            onSubmitted: (value) {
              searchFocus.unfocus();
              eventProvider.setKeyword(value);
            },
          ),
        ),
        const SizedBox(width: 5,),
      ],
    );
  }
}
