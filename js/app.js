var App = {
    data () {
      return {
        editor: {},
        log: {},
        logText: '',
        buttonText: 'Run',
        buttonLoading: false,
        status: ''
      }
    },
    methods: {
      getParameters(arr) {
        var obj = {}
        arr.forEach(function (item) {
          obj[item.name] = item.valueString;
        })
        return obj;
      },
      runCode() {
        //console.log(this.editor.getCode())
        this.buttonText = 'Loading';
        this.buttonLoading = true;

        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://cql-sandbox.alphora.com/cqf-ruler-r4/fhir/$cql", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({"resourceType":"Parameters","parameter":[{"name":"code","valueString":this.editor.getCode()}]}));

        xhr.onload = function() {
          self.logText += '\n' + '>> ' + 'Running code at ' + new Date().toLocaleString();
          var response = JSON.parse(this.responseText);
          //console.log(response);
          response.entry.forEach(function (entry) {
            parameters = self.getParameters(entry.resource.parameter);
            if (entry.resource.id != 'Error') {
              self.logText += '\n' + '>> ' + entry.resource.id + '=' + parameters.value;
              self.status = 'success';
            } else {
              self.logText += '\n' + '>> ' + entry.resource.id + ' ' + parameters.location + ' ' + parameters.value;
              self.status = 'error';
            }
          })
          self.log.updateCode(self.logText);
          self.buttonText = 'Run';
          self.buttonLoading = false;
        }
      },
      clearLog() {
        this.status = '';
        this.logText = '';
        this.log.updateCode(this.logText);
      }
    },
    mounted() {
      this.editor = new CodeFlask('#editor', { language: 'js', lineNumbers: true});
      document.querySelector('#editor>.codeflask').style = "height: 50vh; width: 95vw;";
      this.log = new CodeFlask('#log', { language: 'js', readonly: true});
      document.querySelector('#log>.codeflask').style = "height: 18vh; width: 95vw;";
      this.editor.updateCode("define bla:\n\t1>0");
    }
}

var app = Vue.createApp(App);
app.use(ElementPlus);
app.mount('#app')
