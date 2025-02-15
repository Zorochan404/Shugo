import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
import 'package:shugo/functions/fetchLocation.dart';
import 'package:shugo/widgets/mapmodal.dart';
import 'package:shugo/widgets/pointmap.dart';
import 'package:get/get.dart';

class Homepage extends StatefulWidget {
  const Homepage({super.key});

  @override
  State<Homepage> createState() => _HomepageState();
}

class _HomepageState extends State<Homepage> {
  final locationController = Location();
  LatLng? currentPosition;
  final controller = Get.put(MapController());

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance
        .addPostFrameCallback((_) async => await fetchLocationUpdates());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
          backgroundColor: Colors.green,
          child: Icon(LucideIcons.mapPinned),
          onPressed: () {
            MaptypeModal(context);
          }),
      body: Obx(() => controller.screens[controller.selectedIndex.value]),
    );
  }
}

class MapController extends GetxController {
  final Rx<int> selectedIndex = 0.obs;

  static const LatLng _pGooglePlex = LatLng(26.142054, 91.660482);
  static const LatLng MountainView = LatLng(26.158117, 91.689965);
  final Rx<LatLng?> currentPosition = Rx<LatLng?>(null);

  List<Widget> get screens => [
        Obx(() => currentPosition.value == null
            ? const Center(child: CircularProgressIndicator())
            : PointMap(
                currentPosition: currentPosition.value,
                pGooglePlex: _pGooglePlex,
                MountainView: MountainView,
              )),
        const Scaffold(body: Text("Report")),
      ];
}
