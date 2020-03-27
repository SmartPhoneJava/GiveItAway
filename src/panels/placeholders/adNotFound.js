import React from "react";
import { Placeholder, Button } from "@vkontakte/vkui";

import Icon56UsersOutline from "@vkontakte/icons/dist/56/users_outline";

const AdNotFound = dropFilters => {
  return (
    <Placeholder
      icon={<Icon56UsersOutline />}
      header="Упс &#128566;"
      action={
        <Button onClick={() => dropFilters()} size="l">
          Сбросить фильтры
        </Button>
      }
      stretched={true}
    >
      Кажется, ничего не удалось найти. Попробуйте изменить фильтры, чтобы найти
      больше объявлений!
    </Placeholder>
  );
};

export default AdNotFound;
