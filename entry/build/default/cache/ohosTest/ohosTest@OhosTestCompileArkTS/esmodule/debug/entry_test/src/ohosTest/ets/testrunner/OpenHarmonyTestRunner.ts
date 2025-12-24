import abilityDelegatorRegistry from "@ohos:app.ability.abilityDelegatorRegistry";
import type TestRunner from "@ohos:application.testRunner";
import { Hypium } from "@package:pkg_modules/.ohpm/@ohos+hypium@1.0.24/pkg_modules/@ohos/hypium/index";
import testsuite from "@bundle:com.example.list_harmony/entry_test/ets/test/List.test";
export default class OpenHarmonyTestRunner implements TestRunner {
    onPrepare() {
    }
    onRun() {
        const abilityDelegatorArguments = abilityDelegatorRegistry.getArguments();
        const abilityDelegator = abilityDelegatorRegistry.getAbilityDelegator();
        Hypium.hypiumTest(abilityDelegator, abilityDelegatorArguments, testsuite);
    }
}
