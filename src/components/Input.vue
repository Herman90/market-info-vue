<template>
  <span>
    <label v-if="label">{{label}}</label>
    <input ref="input" :type="type" :value="value" @input="updateValue()" readonly/>
  </span>
</template>

<script>
export default {
  props: ['value', 'type', 'label'],
  methods: {
    updateValue() {
      this.$emit('input', this.$refs.input.value)
    }
  }
}
</script>

<style scoped>
  input {
    width: 80px;
    height: 25px;
    border-radius: 2px;
    border: 1px solid #cecece;
    padding: 3px 0 3px 8px;
  }

  label {
    margin-right: 8px; 
  }
</style>