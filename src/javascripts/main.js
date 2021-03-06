var Vue = require('vue');
var request = require('superagent');

window.doctorNaming = new Vue({
  el: '#DN',
  components: {
    header: require('./header'),
    teams: require('./teams'),
    repos: require('./repos'),
    select_repos: require('./select_repos'),
  },
  data: {
    title: 'DoctorNaming',
    avatar: {
      github: {},
      orgs: {}
    },
    repos: {},
    urls: {
      orgs: '/siteapi/orgs',
      repos: '/siteapi/repos',
      select_repos: '/siteapi/select_repos'
    }
  },
  methods: {},
  ready: function() {
    var self = this;
    this.$on('get repositories', function(owner) {
      self.$broadcast('get repositories', [owner]);
    });
  }
});
