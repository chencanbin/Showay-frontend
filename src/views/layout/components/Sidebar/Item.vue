<template>
	<div>
		<!-- <i :class="icon" class="iconfont" v-sidebar-item="icon" /> -->
		<svg class="iconfont" aria-hidden="true" v-sidebar-item>
			<use :xlink:href="'#' + icon"></use>
		</svg>
		<span slot="title">{{ title }}</span>
	</div>
</template>
<script>
import sidebarItem from '@/directive/sidebar-item';
export default {
	name: 'MenuItem',
	// functional: true,
	directives: {
		sidebarItem: {
			bind(el, binding, vNode) {
        console.log('vNode: ', vNode);
				const active = vNode.context.$parent.active;
				if (active) {
					const icon = vNode.context.icon;
					const iconName = icon.slice(0, -4);
					vNode.context.icon = `${iconName}_select`;
				}
			},
		},
	},
	props: {
		icon: {
			type: String,
			default: '',
		},
		title: {
			type: String,
			default: '',
		},
	},
  computed: {
    getIcon() {
      return `#${this.icon}`;
    }
  },
	// render(h, context) {
	//   const { icon, title } = context.props;
	//   const vnodes = [];

	//   if (icon) {
	//     vnodes.push(<i class="" class={`iconfont ${icon}`} />);
	//   }

	//   if (title) {
	//     vnodes.push(<span slot="title">{title}</span>);
	//   }
	//   return vnodes;
	// },
};
</script>
