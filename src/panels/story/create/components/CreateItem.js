import React, { useState } from "react";
import {
  FormLayout,
  Input,
  Button,
  Card,
  CardGrid,
  Div,
  Textarea,
  File,
  SelectMimicry,
  Gallery,
  Header,
  Group
} from "@vkontakte/vkui";

import ImageGallery from "react-image-gallery";

import {
  Categories,
  GetCategoryText,
  CategoriesLabel
} from "./../../../template/Categories";

import Icon24Camera from "@vkontakte/icons/dist/24/camera";
import Icon24Document from "@vkontakte/icons/dist/24/document";

const nameLabel = "Название";
const categoryLabel = "Категория";
const descriptionLabel = "Описание";

const images = [
  {
    original: "https://picsum.photos/id/1018/1000/600/",
    thumbnail: "https://picsum.photos/id/1018/250/150/"
  },
  {
    original: "https://picsum.photos/id/1015/1000/600/",
    thumbnail: "https://picsum.photos/id/1015/250/150/"
  },
  {
    original: "https://picsum.photos/id/1019/1000/600/",
    thumbnail: "https://picsum.photos/id/1019/250/150/"
  }
];

const CreateItem = props => {
  const [name, setName] = useState(props.name);
  const [description, setDescription] = useState("");

  return (
    <CardGrid>
      <Card size="l">
        {props.len > 1 ? (
          <Div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "5px"
            }}
          >
            <Button
              mode="destructive"
              onClick={() => {
                props.deleteMe();
              }}
            >
              Удалить
            </Button>
          </Div>
        ) : (
          <div />
        )}

        <Div
          style={{
            display: "flex",
            alignItems: "flex-start",
            padding: "0px"
          }}
        >
          <FormLayout>
            <Input
              top={nameLabel}
              name={nameLabel}
              size="50"
              placeholder="футбольный мяч"
              value={name}
              onChange={e => {
                const { _, value } = e.currentTarget;
                setName(value);
                props.setItems({
                  name: value,
                  caregory: props.category,
                  description,
                  photos: props.item.photos
                });
              }}
              status={name ? "valid" : "error"}
            />
          </FormLayout>
          <CategoriesLabel category={props.category} open={props.choose} />
        </Div>
        <Div
          style={{
            padding: "0px"
          }}
        >
          <FormLayout>
            <Textarea
              top={descriptionLabel}
              name={descriptionLabel}
              placeholder="Количество, состояние, габариты, дата покупки, особенности и т.д."
              value={description}
              onChange={e => {
                const { _, value } = e.currentTarget;
                setDescription(value);
                props.setItems({
                  name,
                  category: props.category,
                  description: value,
                  photos: props.item.photos
                });
              }}
              status={description ? "valid" : "error"}
            />
          </FormLayout>
        </Div>
        <FormLayout>
          <File
            top="Снимки вещей"
            before={<Icon24Camera />}
            size="l"
            onChange={e => {
              const file = e.target.files[0];
              console.log("files", e.target.files);
              //e.target.files.FileList.forEach(file => {
              console.log("file:", file);
              props.setItems({
                name,
                category: props.category,
                description: description,
                photos: [...props.item.photos, file]
              });
              // var reader = new FileReader();
              // reader.readAsDataURL(file);

              // reader.onloadend = function(e) {
              //   props.setItems({
              //     name,
              //     category: props.category,
              //     description: description,
              //     photos: [...props.item.photos, reader.result]
              //   });
              // };

              //});
            }}
          >
            Открыть галерею
          </File>
          <Div
            style={{
              display: "flex",
              alignItems: "flex-start",
              padding: "0px"
            }}
          >
            {props.item.photos.map(img => {
              return (
                <img
                  src={img}
                  style={{
                    display: "flex",
                    width: "10%",
                    height: "10%"
                  }}
                />
              );
            })}
            <img src={props.item.photos[0]} />
            <ImageGallery items={images} />;
          </Div>
        </FormLayout>
      </Card>
    </CardGrid>
  );
};

export default CreateItem;
