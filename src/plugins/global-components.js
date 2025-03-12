import BaseContainer from '/src/components/base/BaseContainer.vue'
import BaseCard from '/src/components/base/BaseCard.vue'
import BaseButton from '/src/components/base/BaseButton.vue'
import BaseProgress from '/src/components/base/BaseProgress.vue'
import BaseIcon from '/src/components/base/BaseIcon.vue'

export default function registerGlobalComponents(app) {
  app.component('BaseContainer', BaseContainer)
  app.component('BaseCard', BaseCard)
  app.component('BaseButton', BaseButton)
  app.component('BaseProgress', BaseProgress)
  app.component('BaseIcon', BaseIcon)
}
// This file globally registers base UI components for use across the application.