module.exports = {
  events: {
    'click .add-section': 'addSection',
    'click .delete-section': 'deleteSection',
    'click .add-sectionnew': 'addSectionNew',
    'click .delete-sectionnew': 'deleteSectionNew',
  },

  methods: {
    addSection(e) {
      e.preventDefault();
      let sectionName = e.target.dataset.section;
      let template = require('templates/section.pug');
      this[sectionName + 'Index']++;
      $('.' + sectionName).append(
          template({
            fields: this.fields,
            name: sectionName,
            attr: {
              class1: '',
              class2: '',
              app: app,
              type: this.fields[sectionName].type,
              index: this[sectionName + 'Index'],
            },
            // values: this.model.toJSON(),
            values: this.model,
          })
      );
    },

    deleteSection(e) {
      e.preventDefault();
      if(confirm('Are you sure?')) {
        let sectionName = e.currentTarget.dataset.section;
        if($('.' + sectionName + ' .delete-section-container').length > 1) {
          $('.' + sectionName + ' .index_' + e.currentTarget.dataset.index).remove();
          e.currentTarget.offsetParent.remove();
        } else {
          $('.' + sectionName + ' .index_' + e.currentTarget.dataset.index + ' input').val('');
          $('.' + sectionName + ' .index_' + e.currentTarget.dataset.index + ' textarea').val('');
        }
      }

      // ToDo
      // Fix index counter
      // this[sectionName + 'Index'] --;
    },

    addSectionNew(e) {
      e.preventDefault();
      const sectionName = e.target.dataset.section;
      const template = require('components/' + e.target.dataset.comp + '/templates/snippets/' + e.target.dataset.template + '.pug');
      this[sectionName + 'Index']++;

      $('.' + sectionName + '_container').append(
        template({
          fields: this.fields[sectionName],
          name: e.target.dataset.section,
          attr: this.fields[sectionName],
          value: [],
          index: this[sectionName + 'Index']
        })
      );
    },

    deleteSectionNew(e) {
      e.preventDefault();
      if(confirm('Are you sure?')) {
        let sectionName = e.currentTarget.dataset.section;
        if(this.$el.find('.' + sectionName).length > 1) {
          $(e.target).parents('.addSectionBlock').remove();
        } else {
          this.$el.find('.' + sectionName + ' [data-index=' + e.currentTarget.dataset.index + '] input').val('');
          this.$el.find('.' + sectionName + ' [data-index=' + e.currentTarget.dataset.index + '] textarea').val('');
        }
        this[sectionName + 'Index'] --;
        // TODO
        // Fix index of the next fields
      }
    },

    createIndexes() {
      _(this.fields).each((el, key) => {
        if(el.type == 'nested') {
          if(typeof options.model[key] != 'object') {
            this[key + 'Index'] = -1;
          }
          else {
            this[key + 'Index'] = Array.isArray(options.model[key]) ? 
              options.model[key].length - 1: Object.keys(options.model[key]).length - 1;
          }
        }
      });
    }
  },
};
