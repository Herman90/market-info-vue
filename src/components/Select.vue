<template>
      <md-field class="custom">
        <md-select class="select" :value="this.value" @input="updateValue($event)" :placeholder="placeholder">
          <md-option v-for="item in items" v-bind:key="item.value" v-bind:value="item.value">{{ item.text }}</md-option>
        </md-select>
      </md-field>
</template>

<script>
export default {
  props: [
    'value',
    'data', 
    'valueProperty', 
    'textProperty',
    'placeholder'
  ],
  data() {
    return {
      theme: null
    }
  },
  computed: {
    items() {
      if (!!this.valueProperty && !!this.textProperty) {
        return this.data.map(item => ({ text: item[this.textProperty], value: item[this.valueProperty] }));
      }

      return this.data.map(item => ({ text: item.text, value: item.value }));
      
    }
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style scoped>
  .select,
  .md-menu.md-select {
    background-color: rgba(255,255,255,0.12);
    border-radius: 2px;
    height: 40px;
    align-items: center;
    padding: 0 0 0 15px;
  }

  .md-field {
    min-height: 40px!important;
  }

  .md-field:after {
    height: 0px!important;
  }

  .md-field.custom.md-theme-default.md-has-value >>> .md-input.md-select-value,
  .md-field.md-theme-default .md-input.md-select-value::placeholder
  {
    -webkit-text-fill-color: white;
  }
</style>