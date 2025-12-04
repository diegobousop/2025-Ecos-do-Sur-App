import React from 'react';
import { Image, Linking, Text, TextProps, useColorScheme, View } from 'react-native';

interface FormattedTextProps extends TextProps {
  children: string;
}

export const FormattedText = ({ children, className, ...props }: FormattedTextProps) => {
  const colorScheme = useColorScheme();
  if (!children) return null;

  const rawParts = children.split(/(\*[^*]+\*)/g);
  
  const tokens: any[] = [];
  let stepCounter = 0;

  rawParts.forEach((part) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      const content = part.slice(1, -1);
      if (content.startsWith('Si ') && content.endsWith(':')) {
        stepCounter++;
        tokens.push({ type: 'box', content, id: stepCounter });
      } else {
        tokens.push({ type: 'bold', content });
      }
    } else {
      const dashRegex = /(-{3,})/g;
      const dashParts = part.split(dashRegex);
      dashParts.forEach(dashPart => {
        if (dashPart.match(dashRegex)) {
          tokens.push({ type: 'divider' });
        } else if (dashPart) {
           tokens.push({ type: 'text', content: dashPart });
        }
      });
    }
  });

  const elements: any[] = [];
  let currentInlineGroup: any[] = [];

  const flushInlineGroup = () => {
    if (currentInlineGroup.length > 0) {
      elements.push({ type: 'inline-group', items: [...currentInlineGroup] });
      currentInlineGroup = [];
    }
  };

  tokens.forEach(token => {
    if (token.type === 'box' || token.type === 'divider') {
      flushInlineGroup();
      elements.push(token);
    } else {
      currentInlineGroup.push(token);
    }
  });
  flushInlineGroup();

  return (
    <View className="flex-col items-start w-full">
      {elements.map((element, index) => {
        if (element.type === 'box') {
          return (
            <View key={`box-${index}`} className="relative flex-row items-center py-3 px-3 bg-transparent rounded-3xl mx-1 border border-2 border-[#ECB6B7] w-full my-1">
              <Image source={require('@/assets/images/step.png')} style={{ width: 50, height: 50, marginRight: 8 }} resizeMode="contain" />
              <Text className="absolute left-5 font-semibold">{element.id}</Text>
              <Text className={`font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-black'} text-base text-[16px] flex-1 flex-wrap`}>
                {element.content}
              </Text>
            </View>
          );
        }
        if (element.type === 'divider') {
          return <View key={`divider-${index}`} className="w-full h-[1px] bg-gray-300 my-2" />;
        }
        if (element.type === 'inline-group') {
          return (
            <Text key={`group-${index}`} className={className} {...props}>
              {element.items.map((item: any, itemIndex: number) => {
                if (item.type === 'bold') {
                  return <Text key={`bold-${itemIndex}`} className="font-bold">{item.content}</Text>;
                }
                // item.type === 'text'
                const urlRegex = /(https?:\/\/[^\s]+)/g;
                const textParts = item.content.split(urlRegex);
                return textParts.map((subPart: string, subIndex: number) => {
                  if (subPart.match(urlRegex)) {
                    return (
                      <Text
                        key={`link-${itemIndex}-${subIndex}`}
                        className="text-blue-600 underline"
                        onPress={() => Linking.openURL(subPart)}
                      >
                        {subPart}
                      </Text>
                    );
                  }
                  return <Text key={`text-${itemIndex}-${subIndex}`}>{subPart}</Text>;
                });
              })}
            </Text>
          );
        }
        return null;
      })}
    </View>
  );
};
