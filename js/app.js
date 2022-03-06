var App = {
    data () {
      return {
        editor: {},
        log: {},
        logText: ''
      }
    },
    methods: {
      clicked() {
        //console.log(this.editor.getCode())
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://cql-sandbox.alphora.com/cqf-ruler-r4/fhir/$cql", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({"resourceType":"Parameters","parameter":[{"name":"code","valueString":this.editor.getCode()}]}));
        xhr.onload = function() {
          self.logText += '\n' + new Date().toLocaleString();
          var response = JSON.parse(this.responseText);
          console.log(response);
          response.entry.forEach(function (entry) {
            if (entry.resource.id != 'Error') {
              entry.resource.parameter.forEach(function (parameter) {
                if (parameter.name == 'value')
                  self.logText += '\n' + '>>' + entry.resource.id + '=' + parameter.valueString;
              })
            } else {
              self.logText += '\n' + '>>' + entry.resource.id + ' ' + entry.resource.parameter[0].valueString + ' ' + entry.resource.parameter[1].valueString;
            }
          })
          self.log.updateCode(self.logText);
        }
      }
    },
    mounted() {
      this.editor = new CodeFlask('#editor', { language: 'js', lineNumbers: true});
      document.querySelector('#editor>.codeflask').style = "height: 60vh; width: 95vw;";
      this.log = new CodeFlask('#log', { language: 'js', readonly: true});
      document.querySelector('#log>.codeflask').style = "height: 25vh; width: 95vw;";
      this.editor.updateCode("define bla:\n\t1>0");
    }
}

var app = Vue.createApp(App);
app.use(ElementPlus);
app.mount('#app')
