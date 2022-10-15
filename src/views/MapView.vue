<template>
  <v-row>
    <v-col md="12">
      <l-map style="height: 600px" :zoom="zoom" :center="center">
        <l-tile-layer :url="url" :attribution="attribution" />
        <l-marker
          :key="index"
          v-for="(user, index) in userList"
          :lat-lng="latLng(user.latitude, user.longitude)"
        >
          <l-popup>
            <div>
              <h4>Details</h4>
              <p>Name:{{ user.name }}</p>
              <p>Email:{{ user.email }}</p>
              <p>Mobile number:{{ user.mobileNo }}</p>
              <p>Address:{{ user.address }}</p>
            </div>
          </l-popup>
        </l-marker>
      </l-map>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { latLng, Icon } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
export default {
  name: "MapView",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
  },
  data() {
    return {
      zoom: 3,
      center: latLng(18.52043, 73.856743),
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      currentZoom: 11.5,
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5,
      },
      showMap: true,
      markerLatLng: latLng(23.030357, 72.517845),
    };
  },
  computed: {
    ...mapGetters(["userList"]),
  },
  watch: {
    userList: function (value) {
      console.log(value, "userlist in watch");
    },
  },

  created() {
    this.fetchuserList();
  },
  methods: {
    ...mapActions(["fetchuserList"]),
    latLng: function (lat, lng) {
      return latLng(lat, lng);
    },

    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
    innerClick() {
      alert("Click!");
    },
  },
};
</script>
