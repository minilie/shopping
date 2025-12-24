import type AbilityConstant from "@ohos:app.ability.AbilityConstant";
import UIAbility from "@ohos:app.ability.UIAbility";
import type Want from "@ohos:app.ability.Want";
import { Hypium } from "@package:pkg_modules/.ohpm/@ohos+hypium@1.0.24/pkg_modules/@ohos/hypium/index";
import testsuite from "@bundle:com.example.list_harmony/entry_test/ets/test/List.test";
export default class TestAbility extends UIAbility {
    onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
        Hypium.hypiumTest(testsuite, 0, (data: string) => {
            console.info(data);
        });
    }
}
