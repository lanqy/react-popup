import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  PopupParameters,
  DismissSource,
  Position,
  AppearAnimation,
  defaultPopupParameters,
  PopupType,
  DisplayMode,
} from './types';

interface PopupProps {
  isPresented?: boolean;
  item?: any;
  onDismiss?: (source: DismissSource) => void;
  customize?: (params: PopupParameters) => PopupParameters;
  children: React.ReactNode;
}

interface AnimationState {
  visible: boolean;
  transitioning: boolean;
}

const getPopupStyle = (
  position: Position,
  type: PopupType,
  displayMode: DisplayMode
): React.CSSProperties => {
  const isFixed = displayMode !== DisplayMode.Overlay;
  const isWindow = displayMode === DisplayMode.Window;
  
  const isTop = position.startsWith('top');
  const isBottom = position.startsWith('bottom');
  const isLeading = position === Position.Leading || position === Position.TopLeading || position === Position.BottomLeading;
  const isTrailing = position === Position.Trailing || position === Position.TopTrailing || position === Position.BottomTrailing;
  const isCenter = position === Position.Center;

  const baseStyle: React.CSSProperties = {
    position: isFixed ? 'fixed' : 'absolute',
    zIndex: 9999,
  };

  const padding = type === PopupType.Floater ? 16 : 0;
  const safeAreaTop = isWindow ? 60 : 0;

  // Toast: full width at top/bottom
  if (type === PopupType.Toast) {
    if (isTop) {
      return { ...baseStyle, top: 0, left: 0, right: 0, width: '100%' };
    }
    if (isBottom) {
      return { ...baseStyle, bottom: 0, left: 0, right: 0, width: '100%' };
    }
    // Center toast
    return { ...baseStyle, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  }

  // Floater: has padding, auto width
  if (type === PopupType.Floater) {
    if (isTop && isLeading) {
      return { ...baseStyle, top: safeAreaTop + padding, left: padding };
    }
    if (isTop && isTrailing) {
      return { ...baseStyle, top: safeAreaTop + padding, right: padding };
    }
    if (isTop) {
      return { ...baseStyle, top: safeAreaTop + padding, left: '50%', transform: 'translateX(-50%)' };
    }
    if (isBottom && isLeading) {
      return { ...baseStyle, bottom: padding, left: padding };
    }
    if (isBottom && isTrailing) {
      return { ...baseStyle, bottom: padding, right: padding };
    }
    if (isBottom) {
      return { ...baseStyle, bottom: padding, left: '50%', transform: 'translateX(-50%)' };
    }
    if (isLeading) {
      return { ...baseStyle, top: '50%', left: padding, transform: 'translateY(-50%)' };
    }
    if (isTrailing) {
      return { ...baseStyle, top: '50%', right: padding, transform: 'translateY(-50%)' };
    }
    if (isCenter) {
      return { ...baseStyle, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  }

  // Default popup
  if (isTop && isLeading) {
    return { ...baseStyle, top: safeAreaTop, left: 0 };
  }
  if (isTop && isTrailing) {
    return { ...baseStyle, top: safeAreaTop, right: 0 };
  }
  if (isTop) {
    return { ...baseStyle, top: safeAreaTop, left: '50%', transform: 'translateX(-50%)' };
  }
  if (isBottom && isLeading) {
    return { ...baseStyle, bottom: 0, left: 0 };
  }
  if (isBottom && isTrailing) {
    return { ...baseStyle, bottom: 0, right: 0 };
  }
  if (isBottom) {
    return { ...baseStyle, bottom: 0, left: '50%', transform: 'translateX(-50%)' };
  }
  if (isLeading) {
    return { ...baseStyle, top: '50%', left: 0, transform: 'translateY(-50%)' };
  }
  if (isTrailing) {
    return { ...baseStyle, top: '50%', right: 0, transform: 'translateY(-50%)' };
  }
  if (isCenter) {
    return { ...baseStyle, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  }

  return baseStyle;
};

const getAnimationStyle = (
  animation: AppearAnimation,
  isAppearing: boolean,
  position: Position,
  type: PopupType
): React.CSSProperties => {
  const isTop = position.startsWith('top');
  const isBottom = position.startsWith('bottom');
  const isLeading = position === Position.Leading || position === Position.TopLeading || position === Position.BottomLeading;
  const isTrailing = position === Position.Trailing || position === Position.TopTrailing || position === Position.BottomTrailing;
  const isCenter = position === Position.Center;
  const isToast = type === PopupType.Toast;

  if (animation === AppearAnimation.None) {
    return { opacity: isAppearing ? 1 : 0 };
  }

  // Toast: use margin for animation instead of transform
  if (isToast) {
    const marginValue = isAppearing ? '0' : '-100%';
    return { 
      opacity: isAppearing ? 1 : 0,
      marginTop: isTop ? marginValue : 0,
      marginBottom: isBottom ? marginValue : 0,
    };
  }

  // Center scale animation
  if (animation === AppearAnimation.CenterScale) {
    const scale = isAppearing ? 1 : 0;
    if (isCenter) {
      return { opacity: isAppearing ? 1 : 0, transform: `translate(-50%, -50%) scale(${scale})` };
    }
    if (isLeading || isTrailing) {
      return { opacity: isAppearing ? 1 : 0, transform: `translateY(-50%) scale(${scale})` };
    }
    if (isTop || isBottom) {
      return { opacity: isAppearing ? 1 : 0, transform: `translateX(-50%) scale(${scale})` };
    }
    return { opacity: isAppearing ? 1 : 0, transform: `scale(${scale})` };
  }

  // Slide animations
  let offset: string;
  switch (animation) {
    case AppearAnimation.TopSlide:
      offset = isAppearing ? '0' : '-100%';
      break;
    case AppearAnimation.BottomSlide:
      offset = isAppearing ? '0' : '100%';
      break;
    case AppearAnimation.LeftSlide:
      offset = isAppearing ? '0' : '-100%';
      break;
    case AppearAnimation.RightSlide:
      offset = isAppearing ? '0' : '100%';
      break;
    default:
      offset = '0';
  }

  let transform: string;
  switch (animation) {
    case AppearAnimation.TopSlide:
      transform = `translateY(${offset})`;
      break;
    case AppearAnimation.BottomSlide:
      transform = `translateY(${offset})`;
      break;
    case AppearAnimation.LeftSlide:
      transform = `translateX(${offset})`;
      break;
    case AppearAnimation.RightSlide:
      transform = `translateX(${offset})`;
      break;
    default:
      transform = 'none';
  }

  // Add position-specific centering
  if (isCenter) {
    transform = `translate(-50%, -50%) ${transform}`.trim();
  } else if (isLeading) {
    transform = `translateY(-50%) ${transform}`.trim();
  } else if (isTrailing) {
    transform = `translateY(-50%) ${transform}`.trim();
  } else if (isTop) {
    transform = `translateX(-50%) ${transform}`.trim();
  } else if (isBottom) {
    transform = `translateX(-50%) ${transform}`.trim();
  }

  return { opacity: isAppearing ? 1 : 0, transform };
};

const getDisappearAnimation = (
  animation: AppearAnimation | undefined,
  position: Position
): AppearAnimation => {
  if (animation) return animation;

  const isTop = position.startsWith('top');
  const isBottom = position.startsWith('bottom');
  const isLeading = position === Position.Leading || position === Position.TopLeading || position === Position.BottomLeading;
  const isTrailing = position === Position.Trailing || position === Position.TopTrailing || position === Position.BottomTrailing;

  if (isTop) return AppearAnimation.TopSlide;
  if (isBottom) return AppearAnimation.BottomSlide;
  if (isLeading) return AppearAnimation.LeftSlide;
  if (isTrailing) return AppearAnimation.RightSlide;
  return AppearAnimation.CenterScale;
};

const calculateAppearFrom = (
  position: Position,
  appearFrom: AppearAnimation | undefined
): AppearAnimation => {
  if (appearFrom) return appearFrom;

  const isTop = position.startsWith('top');
  const isBottom = position.startsWith('bottom');
  const isLeading = position === Position.Leading || position === Position.TopLeading || position === Position.BottomLeading;
  const isTrailing = position === Position.Trailing || position === Position.TopTrailing || position === Position.BottomTrailing;

  if (isTop) return AppearAnimation.TopSlide;
  if (isBottom) return AppearAnimation.BottomSlide;
  if (isLeading) return AppearAnimation.LeftSlide;
  if (isTrailing) return AppearAnimation.RightSlide;
  return AppearAnimation.CenterScale;
};

const getTransition = (
  animation: AppearAnimation,
  duration: number,
  isAppearing: boolean,
  type?: PopupType
): string => {
  if (animation === AppearAnimation.None) {
    return `opacity ${duration}ms ease-out`;
  }

  const timing = isAppearing 
    ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' 
    : 'cubic-bezier(0.4, 0, 0.2, 1)';
  
  // Toast uses margin for animation
  if (type === PopupType.Toast) {
    return `opacity ${duration}ms ${timing}, margin ${duration}ms ${timing}`;
  }
  
  return `opacity ${duration}ms ${timing}, transform ${duration}ms ${timing}`;
};

export const Popup: React.FC<PopupProps> = ({
  isPresented = false,
  item = null,
  onDismiss,
  customize,
  children,
}) => {
  const params = customize ? customize({}) : {};
  const config = { ...defaultPopupParameters, ...params };

  const [animationState, setAnimationState] = useState<AnimationState>({
    visible: false,
    transitioning: false,
  });

  const [isAppearing, setIsAppearing] = useState(true);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dismissEnabled, setDismissEnabled] = useState(true);
  
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const prevPresentedRef = useRef(isPresented || item !== null);
  const isDraggingRef = useRef(false);

  const isPresentedValue = isPresented || item !== null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && animationState.visible) {
        onDismiss?.(DismissSource.Binding);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [animationState.visible, onDismiss]);

  useEffect(() => {
    if (isPresentedValue !== prevPresentedRef.current) {
      prevPresentedRef.current = isPresentedValue;
      
      if (isPresentedValue) {
        setAnimationState({ visible: true, transitioning: true });
        setIsAppearing(true);
        setDragOffset({ x: 0, y: 0 });
        setDismissEnabled(true);
      } else {
        setAnimationState((prev) => ({ ...prev, transitioning: true }));
        setIsAppearing(false);
      }
    }
  }, [isPresentedValue]);

  useEffect(() => {
    if (animationState.transitioning) {
      const timer = setTimeout(() => {
        if (!isAppearing) {
          setAnimationState({ visible: false, transitioning: false });
          setDragOffset({ x: 0, y: 0 });
        }
      }, config.animation.duration);
      return () => clearTimeout(timer);
    }
  }, [animationState.transitioning, isAppearing, config.animation.duration]);

  useEffect(() => {
    if (config.autohideIn && animationState.visible && !animationState.transitioning) {
      const timer = setTimeout(() => {
        handleDismiss(DismissSource.Autohide);
      }, config.autohideIn * 1000);
      return () => clearTimeout(timer);
    }
  }, [config.autohideIn, animationState.visible, animationState.transitioning]);

  useEffect(() => {
    if (config.dismissibleIn && animationState.visible && !animationState.transitioning) {
      setDismissEnabled(false);
      const timer = setTimeout(() => {
        setDismissEnabled(true);
        handleDismiss(DismissSource.DismissibleIn);
      }, config.dismissibleIn * 1000);
      return () => clearTimeout(timer);
    }
  }, [config.dismissibleIn, animationState.visible, animationState.transitioning]);

  const handleDismiss = useCallback(
    (source: DismissSource) => {
      if (!dismissEnabled && source !== DismissSource.Binding && source !== DismissSource.DismissibleIn) {
        return;
      }
      config.willDismissCallback?.(source);
      setAnimationState((prev) => ({ ...prev, transitioning: true }));
      setIsAppearing(false);

      setTimeout(() => {
        config.dismissCallback?.(source);
        onDismiss?.(source);
      }, config.animation.duration);
    },
    [config, onDismiss, dismissEnabled]
  );

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!config.dragToDismiss || isDraggingRef.current || !dismissEnabled) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    dragStartRef.current = { x: clientX, y: clientY };
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragStartRef.current || !config.dragToDismiss || !dismissEnabled) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;
    const threshold = config.dragToDismissDistance || 100;
    
    if (Math.abs(dy) > 5 || Math.abs(dx) > 5) {
      isDraggingRef.current = true;
      setDragOffset({ 
        x: Math.abs(dx) > threshold ? dx * 1.1 : dx * 0.5, 
        y: Math.abs(dy) > threshold ? dy * 1.1 : dy * 0.5 
      });
    }
  };

  const handleDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragStartRef.current || !config.dragToDismiss || !dismissEnabled) return;

    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as React.MouseEvent).clientY;
    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;
    const threshold = config.dragToDismissDistance || 100;

    isDraggingRef.current = false;
    dragStartRef.current = null;

    if (Math.abs(dy) > threshold || Math.abs(dx) > threshold) {
      handleDismiss(DismissSource.Drag);
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleBackgroundClick = () => {
    if (config.closeOnTapOutside && dismissEnabled) {
      handleDismiss(DismissSource.TapOutside);
    }
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (config.closeOnTap && dismissEnabled) {
      handleDismiss(DismissSource.TapInside);
    }
  };

  if (!animationState.visible && !animationState.transitioning) return null;

  const popupStyle = getPopupStyle(config.position!, config.type!, config.displayMode!);
  
  const calculatedAppearFrom = calculateAppearFrom(config.position!, config.appearFrom);
  const calculatedDisappearTo = getDisappearAnimation(config.disappearTo, config.position!);
  const currentAnimation = isAppearing ? calculatedAppearFrom : calculatedDisappearTo;
  
  const animationStyle = getAnimationStyle(currentAnimation, isAppearing, config.position!, config.type!);
  const transition = getTransition(currentAnimation, config.animation.duration, isAppearing, config.type);

  const isCenterPosition = config.position === Position.Center;
  const isLeadingTrailing = config.position === Position.Leading || config.position === Position.Trailing;
  const isTopBottom = config.position!.startsWith('top') || config.position!.startsWith('bottom');

  const dragTransform = isCenterPosition
    ? `translate(calc(-50% + ${dragOffset.x}px), calc(-50% + ${dragOffset.y}px))`
    : isLeadingTrailing
      ? `translate(calc(0px + ${dragOffset.x}px), calc(-50% + ${dragOffset.y}px))`
      : isTopBottom
        ? `translate(calc(-50% + ${dragOffset.x}px), calc(0px + ${dragOffset.y}px))`
        : `translate(${dragOffset.x}px, ${dragOffset.y}px)`;

  const hasDrag = dragOffset.x !== 0 || dragOffset.y !== 0;
  const finalTransform = hasDrag 
    ? `${animationStyle.transform || ''} ${dragTransform}`.trim()
    : animationStyle.transform;

  const isToast = config.type === PopupType.Toast;

  const popupContent = (
    <div
      style={{
        ...popupStyle,
        ...animationStyle,
        width: isToast ? '100%' : 'auto',
        maxWidth: isToast ? '100%' : '90%',
        transform: finalTransform,
        transition: config.dragToDismiss && hasDrag ? 'none' : transition,
        borderRadius: config.roundCorners,
      }}
      onClick={handleContentClick}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {children}
    </div>
  );

  const background = (
    <div
      onClick={handleBackgroundClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: config.backgroundColor,
        zIndex: 9998,
        opacity: isAppearing ? 1 : 0,
        transition: `opacity ${config.animation.duration}ms ${config.animation.ease}`,
        pointerEvents: animationState.visible ? (config.allowTapThroughBG ? 'none' : 'auto') : 'none',
        ...(config.blurBackground ? {
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        } : {}),
      }}
    >
      {config.backgroundView}
    </div>
  );

  if (config.displayMode === DisplayMode.Sheet) {
    return (
      <>
        {background}
        {popupContent}
      </>
    );
  }

  return createPortal(
    <>
      {background}
      {popupContent}
    </>,
    document.body
  );
};

export default Popup;
