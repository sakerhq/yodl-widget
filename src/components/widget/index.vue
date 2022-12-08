<script>
import { DateTime } from 'luxon'
import WidgetService from '@/services/widget-service.js'
import { LAYOUT_TYPE } from '@/utils/constants'
import ProductSelectionStep from '@/components/widget/product-selection-step.vue'
import SessionDetailStep from '@/components/widget/session-detail-step.vue'

export default {
	name: 'YodlWidget',
	components: {
		ProductSelectionStep,
		SessionDetailStep
	},
	data() {
		return {
			currentStep: 0,
			form: {
				product: null,
				price: null,
				date: null,
				time: null,
				timeZone: null
			},
			loading: false,
			steps: [
        'product-selection-step',
				'session-detail-step'
			],
			user: null
		}
	},
	computed: {
		state() {
			return {
				form: this.form,
				products: this.user.products,
				user: this.user
			}
		}
	},
	methods: {
		onFormUpdate(payload) {
			Object.assign(this.form, payload.data)

			console.table('@on-form-update', this.form)
		},
		onNext(data) {
			if (this.currentStep < this.steps.length - 1)
				this.currentStep++
		},		
		onPrevious(data) {
			if (this.currentStep > 0) 
				this.currentStep--
		},
		async submit(data) {
			this.loading = true

			try {
				const payload = {
					priceId: this.form.price.id,
					scheduledTime: this.form.time,
					scheduledOn: this.form.date,
					timeZone: this.form.timeZone,
					email: data.email,
					name: data.name
				}

				await WidgetService.bookInteraction(payload)

				this.next()
			} catch (error) {
        console.log(error)
			}

			this.loading = false
		},
		onUnmount() {
			window.YodlWidget.unmount()
		},
	},
	mounted() {
		const { options: { layout } } = window.YodlWidget

		// NOTE: Only freeze body for specific layouts
		switch (layout) {
			case LAYOUT_TYPE.default:
				document.body.classList.add('yodl-widget-freeze-body')
		}
	},
	async created() {
		// NOTE: Initialize constants for template
    this.DEFAULT_LAYOUT = LAYOUT_TYPE.default

    const { options: { username, layout }} = window.YodlWidget
    
    this.layout = layout

    this.loading = true
    const { data } = await WidgetService.getUser(username)
      .catch((err) => {
        console.log(err)
      })
    
    this.user = data
    this.form.timeZone = DateTime.local().zoneName || 'Etc/GMT'

    this.loading = false
  }
}
</script>

<template>
  <!-- layout - default -->
  <div
    v-if="(layout === DEFAULT_LAYOUT)"
    class="fixed inset-0 bg-black/25"
		@click.stop.prevent="onUnmount"
  >
		<!-- loading -->
		<div 
			v-if="loading"
			class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
		>
			loading...
		</div>
		<!-- wizard -->
		<div 
			v-else
			@click.stop.prevent=""
			class="yodl-widget absolute bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 h-3/4 md:h-full md:max-h-[640px] w-full md:max-w-[420px] md:border border-black/10 rounded-tl-lg rounded-tr-lg md:rounded-lg bg-white shadow-lg"
		>
			<component 
				:is="steps[currentStep]"
				:state="state"
				@on-form-update="onFormUpdate"
				@on-next="onNext"
				@on-previous="onPrevious"
				@on-unmount="onUnmount"
			/>
		</div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap');

.yodl-widget {
	font-family: 'Manrope';
}
</style>