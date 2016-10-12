// var myModel = require('ember-commons/models/premise');

//export default {a: <%= copycode %>};
//
// export default {a: "b"}
import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  tutut2: <%= copycode %>,
  tutut: "popo"
});
