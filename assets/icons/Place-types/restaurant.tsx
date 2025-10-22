import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

export function Restaurant(props: SvgProps) {
	return (
		<Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
			<Path fill="#fff7f7" d="M7 22v-9.15q-1.275-.35-2.137-1.4T4 9V2h2v7h1V2h2v7h1V2h2v7q0 1.4-.862 2.45T9 12.85V22zm10 0v-8h-3V7q0-2.075 1.463-3.537T19 2v20z" />
		</Svg>
	);
}