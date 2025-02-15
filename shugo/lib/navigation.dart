// import 'package:adventurcarz/features/screens/account/accountsettings.dart';
// import 'package:adventurcarz/features/screens/bookings/bookingscreen.dart';
// import 'package:adventurcarz/features/screens/homescreen/homescreen.dart';
// import 'package:adventurcarz/features/screens/mapscreen/map_screen.dart';
// import 'package:adventurcarz/utils/constants/colors.dart';
// import 'package:adventurcarz/utils/helpers/helper_functions.dart';
import 'package:flutter/material.dart';
// import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:shugo/screens/homepage.dart';

class Navigation extends StatelessWidget {
  const Navigation({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(NavigationController());
    // final dark = AHelperFunctions.isDarkMode(context);

    return Scaffold(
      bottomNavigationBar: Obx(
        () => NavigationBar(
          height: 75,
          elevation: 0,
          selectedIndex: controller.selectedIndex.value,
          onDestinationSelected: (index) =>
              controller.selectedIndex.value = index,
          backgroundColor: Colors.black,
          indicatorColor: Colors.green,
          destinations: const [
            NavigationDestination(
              icon: Icon(
                LucideIcons.house,
              ),
              label: "Home",
            ),
            NavigationDestination(
              icon: Icon(LucideIcons.file),
              label: 'Report',
            ),
            NavigationDestination(icon: Icon(LucideIcons.bell), label: 'Alert'),
            NavigationDestination(
                icon: Icon(LucideIcons.user), label: 'Profile'),
          ],
        ),
      ),
      body: Obx(() => controller.screens[controller.selectedIndex.value]),
    );
  }
}

class NavigationController extends GetxController {
  final Rx<int> selectedIndex = 0.obs;

  final screens = [
    const Homepage(),
    const Scaffold(
      body: Text("Report"),
    ),
    const Scaffold(
      body: Text("Alert"),
    ),
    const Scaffold(
      body: Text("Profile"),
    ),
  ];
}
