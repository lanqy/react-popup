export enum DismissSource {
  Binding = 'binding',
  TapInside = 'tapInside',
  TapOutside = 'tapOutside',
  Drag = 'drag',
  Autohide = 'autohide',
  DismissibleIn = 'dismissibleIn',
}

export enum PopupType {
  Default = 'default',
  Toast = 'toast',
  Floater = 'floater',
  Scroll = 'scroll',
}

export enum DisplayMode {
  Overlay = 'overlay',
  Sheet = 'sheet',
  Window = 'window',
}

export enum Position {
  TopLeading = 'topLeading',
  Top = 'top',
  TopTrailing = 'topTrailing',
  Leading = 'leading',
  Center = 'center',
  Trailing = 'trailing',
  BottomLeading = 'bottomLeading',
  Bottom = 'bottom',
  BottomTrailing = 'bottomTrailing',
}

export enum AppearAnimation {
  TopSlide = 'topSlide',
  BottomSlide = 'bottomSlide',
  LeftSlide = 'leftSlide',
  RightSlide = 'rightSlide',
  CenterScale = 'centerScale',
  None = 'none',
}

export interface AnimationConfig {
  duration: number;
  ease?: string;
}

export interface PopupParameters {
  type?: PopupType;
  displayMode?: DisplayMode;
  position?: Position;
  appearFrom?: AppearAnimation;
  disappearTo?: AppearAnimation;
  animation?: AnimationConfig;
  autohideIn?: number;
  dismissibleIn?: number;
  dragToDismiss?: boolean;
  dragToDismissDistance?: number;
  closeOnTap?: boolean;
  closeOnTapOutside?: boolean;
  allowTapThroughBG?: boolean;
  backgroundColor?: string;
  backgroundView?: React.ReactNode;
  useKeyboardSafeArea?: boolean;
  willDismissCallback?: (source: DismissSource) => void;
  dismissCallback?: (source: DismissSource) => void;
  roundCorners?: number;
  blurBackground?: boolean;
}

export interface DefaultPopupParameters {
  type: PopupType;
  displayMode: DisplayMode;
  position: Position;
  appearFrom: AppearAnimation | undefined;
  disappearTo: AppearAnimation | undefined;
  animation: AnimationConfig;
  autohideIn: number | undefined;
  dismissibleIn: number | undefined;
  dragToDismiss: boolean;
  dragToDismissDistance: number | undefined;
  closeOnTap: boolean;
  closeOnTapOutside: boolean;
  allowTapThroughBG: boolean;
  backgroundColor: string;
  backgroundView: React.ReactNode | undefined;
  useKeyboardSafeArea: boolean;
  willDismissCallback: (source: DismissSource) => void;
  dismissCallback: (source: DismissSource) => void;
  roundCorners: number;
  blurBackground: boolean;
}

export const defaultPopupParameters: DefaultPopupParameters = {
  type: PopupType.Default,
  displayMode: DisplayMode.Window,
  position: Position.Bottom,
  appearFrom: undefined,
  disappearTo: undefined,
  animation: { duration: 0.3, ease: 'ease-out' },
  autohideIn: undefined,
  dismissibleIn: undefined,
  dragToDismiss: true,
  dragToDismissDistance: undefined,
  closeOnTap: true,
  closeOnTapOutside: false,
  allowTapThroughBG: true,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backgroundView: undefined,
  useKeyboardSafeArea: false,
  willDismissCallback: () => {},
  dismissCallback: () => {},
  roundCorners: 0,
  blurBackground: false,
};
