import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

export function Domain(props: SvgProps) {
	return (
		<Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
			<Path fill="#fff7f7" d="M2 21V3h10v4h10v14zm2-2h2v-2H4zm0-4h2v-2H4zm0-4h2V9H4zm0-4h2V5H4zm4 12h2v-2H8zm0-4h2v-2H8zm0-4h2V9H8zm0-4h2V5H8zm4 12h8V9h-8v2h2v2h-2v2h2v2h-2zm4-6v-2h2v2zm0 4v-2h2v2z" />
		</Svg>
	);
}