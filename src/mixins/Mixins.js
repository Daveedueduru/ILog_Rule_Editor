export default {
  methods: {
    checkAlphaNumeric: function($event) {
      let k = $event.keyCode;
      let chars =
        (k > 64 && k < 91) ||
        (k > 96 && k < 123) ||
        k == 8 ||
        k == 32 ||
        (k >= 48 && k <= 57);
      if (!chars) {
        $event.preventDefault();
      } else {
        return true;
      }
    },
    // fnValidation(key, value, name) {
    //   let k = value;
    //   if (
    //     key == "clearTime" ||
    //     key == "networkId" ||
    //     key == "priority" ||
    //     key == "severity" ||
    //     key == "frequencyCount" ||
    //     key == "frequencyTime"
    //   ) {
    //     if ((k < 48 || k > 57) && k !== 46) {
    //       return true;
    //     } else {
    //       this.$toast.error("Enter a numeric value for " + name);
    //       this.$loading.hide();
    //       return false;
    //     }
    //   }
    //   if (key == "region") {
    //     if (k.length < 5) {
    //       return true;
    //     } else {
    //       this.$toast.error(
    //         "No. of characters for region should not exceed 5 "
    //       );
    //       this.$loading.hide();
    //       return false;
    //     }
    //   }
    // }

    fnCheckNumeric(value, name) {
      // if (key == "region") {
      //   if (k.length > 5) {
      //     this.$toast.error(
      //       "No. of characters for region should not exceed 5 "
      //     );
      //     return false;
      //   }
      // } else {
      if (!((value < 48 || value > 57) && value !== 46)) {
        this.$toast.error("Enter a numeric value for " + name);

        return false;
      }
      // }
      return true;
    }
  }
};
