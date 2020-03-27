import React from "react";
import { Placeholder } from "@vkontakte/vkui";

import Icon56ErrorOutline from "@vkontakte/icons/dist/56/error_outline";

const Error = () => {
  return (
    <Placeholder
      style={{ background: "red" }}
      icon={<Icon56ErrorOutline />}
      header="Сервер временно не доступен &#128560;"
      stretched={true}
    >
      Мы работаем над тем, чтобы вернуть все в норму!
    </Placeholder>
  );
};

export default Error;
