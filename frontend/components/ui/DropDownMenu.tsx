import { View, Text } from 'react-native'
import React from 'react'
import * as DropdownMenu from 'zeego/dropdown-menu';
import { Ionicons } from '@expo/vector-icons';


export type Props = {
    items: Array<{
        key: string;
        title: string;

    }>;
    onSelect: (key: string) => void;
}

const DropDownMenu = ({items, onSelect}: Props) => {
  return (
    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            <Ionicons name="chevron-down-outline" size={20} color="#4B5563" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
            <DropdownMenu.Label>Selecciona un idioma</DropdownMenu.Label>

            <DropdownMenu.Item key="42">
                <DropdownMenu.ItemTitle>My item</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
        </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default DropDownMenu