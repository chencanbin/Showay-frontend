<template>
  <div class="tinymce-editor">
    <editor v-model="myValue" :init="init" :disabled="disabled" @onClick="onClick" />
  </div>
</template>

<script>
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import Cookies from "js-cookie";
import "tinymce/themes/modern/theme";
import "tinymce/plugins/image";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/contextmenu";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/colorpicker";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/preview";

const custormListItems = [
  "login",
  "password",
  "name",
  "signature",
  "number",
  "premium",
  "dueDate",
];
const cookieLanguage = Cookies.get("language") || "zh-CN";
let placeholder = "placeholder";
let language_url = "";
let language = "";
let langObject = require("./Lang/en");
if (cookieLanguage === "zh-CN") {
  placeholder = "占位符";
  language = "zh_CN";
  language_url = "/static/tinymce/langs/zh_CN.js";
  langObject = require("./Lang/zh_CN");
}
if (cookieLanguage === "zh-TW") {
  placeholder = "佔位符";
  language = "zh_TW";
  language_url = "/static/tinymce/langs/zh-TW.js";
  langObject = require("./Lang/zh_TW");
}
export default {
  components: {
    Editor,
  },
  props: {
    // 传入一个value，使组件支持v-model绑定
    value: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    plugins: {
      type: [String, Array],
      default:
        "lists image media table textcolor wordcount contextmenu preview",
    },
    toolbar: {
      type: [String, Array],
      default:
        "preview undo redo |  fontsizeselect fontselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | forecolor backcolor lists image table | placeholder",
    },
  },
  data() {
    return {
      // 初始化配置
      init: {
        language_url: language_url,
        language: language,
        skin_url: "/static/tinymce/skins/lightgray",
        height: 310,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: false,
        // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          const img =
            "data:" + blobInfo.blob().type + ";base64," + blobInfo.base64();
          success(img);
        },
        setup(editor) {
          const menuItems = [];
          tinymce.each(custormListItems, function (myListItemName) {
            menuItems.push({
              text: langObject.lang[myListItemName],
              onclick: function () {
                editor.insertContent("&nbsp;${" + myListItemName + "}&nbsp;");
              },
            });
          });
          editor.addButton("placeholder", {
            type: "menubutton",
            tooltip: placeholder,
            text: placeholder,
            icon: false,
            menu: menuItems,
            context: "insert",
          });
        },
      },
      myValue: this.value,
    };
  },
  watch: {
    value(newValue) {
      this.myValue = newValue;
    },
    myValue(newValue) {
      this.$emit("input", newValue);
    },
  },
  mounted() {
    tinymce.init({});
  },
  methods: {
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    // 需要什么事件可以自己增加
    onClick(e) {
      this.$emit("onClick", e, tinymce);
    },
    // 可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = "";
    },
  },
};
</script>
<style scoped>
</style>
