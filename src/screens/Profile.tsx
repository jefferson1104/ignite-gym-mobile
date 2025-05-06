import { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Center, Heading, Text, useToast, VStack } from "@gluestack-ui/themed";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { api } from "@services/api";

import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/app-error";

import defaultUserAvatar from "@assets/userPhotoDefault.png";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { ToastMessage } from "@components/ToastMessage";

type FormDataProps = {
  name: string;
  email: string;
  password?: string | null | undefined;
  old_password?: string | undefined;
  confirm_password?: string | null | undefined;
};

const profileSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().required("Email is required").email("Email is invalid"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .nullable()
    .transform((value) => (!!value ? value : null)),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .when("password", {
      is: (Field: any) => Field,
      then: (schema) =>
        schema
          .nullable()
          .required("Confirm password is required")
          .transform((value) => (!!value ? value : null)),
    }),
});

export function Profile() {
  // Hooks
  const toast = useToast();
  const { user, updateUserProfile } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps, any>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  });

  // States
  const [isUpdating, setIsUpdating] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);

  // Methods
  async function handleUserPhotoSelect() {
    try {
      setPhotoIsLoading(true);

      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) return;

      const photo = photoSelected.assets[0];

      if (photo.uri) {
        const photoInfo = (await FileSystem.getInfoAsync(photo.uri)) as {
          size: number;
        };

        // image size max 5MB
        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            placement: "top",
            render: ({ id }) => (
              <ToastMessage
                id={id}
                title="Imagem muito grande"
                description="Por favor, selecione uma imagem menor que 5MB."
                action="error"
                onClose={() => toast.close(id)}
              />
            ),
          });
        }

        const fileExtension = photo.uri.split(".").pop();

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLocaleLowerCase(),
          uri: photo.uri,
          type: photo.mimeType,
        } as any;

        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append("avatar", photoFile);

        const avatarUpdatedResponse = await api.patch(
          "/users/avatar",
          userPhotoUploadForm,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const toastIdSuccess = "update-avatar-success";

        const userUpdated = user;
        userUpdated.avatar = avatarUpdatedResponse.data.avatar;
        updateUserProfile(userUpdated);

        toast.show({
          placement: "top",
          render: () => (
            <ToastMessage
              id={toastIdSuccess}
              title="Avatar atualizado com sucesso"
              action="success"
              onClose={() => toast.close(toastIdSuccess)}
            />
          ),
        });
      }
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "Atualizar erro de avatar. Por favor, tente novamente.";

      const toastIdError = "update-avatar-error";

      toast.show({
        placement: "top",
        render: () => (
          <ToastMessage
            id={toastIdError}
            title={title}
            action="error"
            onClose={() => toast.close(toastIdError)}
          />
        ),
      });

      console.error("Update avatar user error: ", error);
    } finally {
      setPhotoIsLoading(false);
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdating(true);

      const userUpdated = user;
      userUpdated.name = data.name;

      await api.put("/users", data);

      await updateUserProfile(userUpdated);

      const toastIdSuccess = "update-profile-success";

      toast.show({
        placement: "top",
        render: () => (
          <ToastMessage
            id={toastIdSuccess}
            title="Profile updated successfully"
            action="success"
            onClose={() => toast.close(toastIdSuccess)}
          />
        ),
      });
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "Erro ao atualizar perfil. Por favor, tente novamente.";

      const toastIdError = "update-profile-error";

      toast.show({
        placement: "top",
        render: () => (
          <ToastMessage
            id={toastIdError}
            title={title}
            action="error"
            onClose={() => toast.close(toastIdError)}
          />
        ),
      });

      console.error("Profile update error:", error);
    } finally {
      setIsUpdating(false);
    }
  }

  // Renders
  return (
    <VStack flex={1}>
      <ScreenHeader title="Profile" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          {photoIsLoading ? (
            <Center w="$full">
              <View
                style={{
                  width: 126,
                  height: 126,
                  borderWidth: 2,
                  borderRadius: 100,
                  borderColor: "#ccc",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 4,
                }}
              >
                <Text
                  color="$gray200"
                  textAlign="center"
                  fontFamily="$heading"
                  fontSize="$md"
                >
                  Carregando...
                </Text>
              </View>
            </Center>
          ) : (
            <UserPhoto
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                  : defaultUserAvatar
              }
              alt="User photo"
              size="xl"
            />
          )}

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="$green500"
              fontFamily="$heading"
              fontSize="$md"
              mt="$2"
              mb="$8"
            >
              Alterar Imagem
            </Text>
          </TouchableOpacity>

          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <Input
                  bg="$gray600"
                  placeholder="Name"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <Input
                  bg="$gray600"
                  placeholder="E-mail"
                  onChangeText={onChange}
                  value={value}
                  isReadOnly
                />
              )}
            />
          </Center>

          <Heading
            alignSelf="flex-start"
            fontFamily="$heading"
            color="$gray200"
            fontSize="$md"
            mt="$8"
            mb="$2"
          >
            Alterar senha
          </Heading>

          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="old_password"
              render={({ field: { onChange } }) => (
                <Input
                  bg="$gray600"
                  placeholder="Senha antiga"
                  onChangeText={onChange}
                  secureTextEntry
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange } }) => (
                <Input
                  bg="$gray600"
                  placeholder="Nova senha"
                  onChangeText={onChange}
                  secureTextEntry
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirm_password"
              render={({ field: { onChange } }) => (
                <Input
                  bg="$gray600"
                  placeholder="Confirmar nova senha"
                  onChangeText={onChange}
                  secureTextEntry
                  errorMessage={errors.confirm_password?.message}
                />
              )}
            />

            <Button
              title="Atualizar"
              isLoading={isUpdating}
              onPress={handleSubmit(handleProfileUpdate)}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}
