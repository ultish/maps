import Component from '@glimmer/component';

import HdsButton from '@hashicorp/design-system-components/components/hds/button';

export default class TestComp extends Component {
  get test() {
    return 'yes';
  }

  <template><HdsButton @text='hello' /></template>
}
