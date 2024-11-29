import type {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  /**
   * 设置不可以截屏
   */
  setFlag(): void;
  /**
   * 设置可以截屏
   */
  clearFlag(): void;
}

export default TurboModuleRegistry.get<Spec>('ScreenCapture') as Spec | null;
