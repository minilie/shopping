import { AbilityConstant, UIAbility, Want } from '@kit.AbilityKit';
import { Hypium } from '@ohos/hypium';
import testsuite from '../test/List.test';

export default class TestAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    Hypium.hypiumTest(testsuite, 0, (data: string) => {
      console.info(data);
    });
  }
}
