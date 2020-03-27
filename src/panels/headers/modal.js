import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  ModalPageHeader,
  PanelHeaderButton,
  IS_PLATFORM_ANDROID,
  IS_PLATFORM_IOS
} from "@vkontakte/vkui";

import Icon24Dismiss from "@vkontakte/icons/dist/24/dismiss";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";

export const ModalHeader = props => {
  return (
    <ModalPageHeader
      left={
        IS_PLATFORM_ANDROID && (
          <PanelHeaderButton onClick={() => props.back()}>
            <Icon24Cancel />
          </PanelHeaderButton>
        )
      }
      right={
        IS_PLATFORM_IOS && (
          <PanelHeaderButton onClick={() => props.back()}>
            <Icon24Dismiss />
          </PanelHeaderButton>
        )
      }
    >
      {props.name}
    </ModalPageHeader>
  );
};
