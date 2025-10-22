import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

export function Theater(props: SvgProps) {
	return (
		<Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
			<Path fill="#fff7f7" d="M4 15h2a2 2 0 0 1 2 2v2h1v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2h1v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2h1v3H1v-3h1v-2a2 2 0 0 1 2-2m7-8l4 3l-4 3zM4 2h16a2 2 0 0 1 2 2v9.54a3.9 3.9 0 0 0-2-.54V4H4v9c-.73 0-1.41.19-2 .54V4a2 2 0 0 1 2-2" />
		</Svg>
	);
}