import { ComponentProps } from 'react';
import { ButtonSpinner, Button as GluestackButton, Text } from '@gluestack-ui/themed';

type Props = ComponentProps<typeof GluestackButton> & {
  title: string;
  isLoading?: boolean;
  variant?: 'solid' | 'outline';
}

export function Button({ title, isLoading = false, variant = 'solid', ...rest }: Props) {
  // Renders
  return (
    <GluestackButton
      w="$full"
      h="$14"
      bg={variant === 'outline' ? 'transparent' : '$green500'}
      borderWidth={variant === 'outline' ? "$1" : "$0"}
      borderColor="$green500"
      rounded="$sm"
      $active-bg={variant === 'outline' ? '$gray500' : '$green500'}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <ButtonSpinner color="$white" />
      ) : (
        <Text color={variant === 'outline' ? '$green500' : '$white'} fontFamily='$heading' fontSize="$sm">
          {title}
        </Text>
      )}
    </GluestackButton>
  )
}