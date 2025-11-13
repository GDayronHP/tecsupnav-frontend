import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

export function RestArea(props: SvgProps) {
	const { fill = '#fff7f7', ...otherProps } = props;
	return (
		<Svg width={24} height={24} viewBox="0 0 24 24" {...otherProps}>
			<Path 
				fill={fill} 
				d="M4 18v-3h16v3q0 .425-.288.713T19 19H5q-.425 0-.712-.288T4 18m0-4V9q0-.825.588-1.412T6 7h12q.825 0 1.413.588T20 9v5H4m2-3h12v-2q0-.425-.288-.712T17 8H7q-.425 0-.712.288T6 9v2m14 6v2q0 .425-.288.713T19 20h-1q-.425 0-.712-.288T17 19v-2h3M4 17v2q0 .425.288.713T5 20h1q.425 0 .713-.288T7 19v-2H4Z" 
			/>
		</Svg>
	);
}