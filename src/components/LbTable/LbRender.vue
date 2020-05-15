/* eslint-disable */
<script>
export default {
  name: 'LbRender',
  functional: true,
  props: {
    // eslint-disable-next-line
    scope: Object,
    // eslint-disable-next-line
    render: Function
  },
  render: (h, ctx) => {
    return ctx.props.render ? ctx.props.render(h, ctx.props.scope) : ''
  }
}
</script>
