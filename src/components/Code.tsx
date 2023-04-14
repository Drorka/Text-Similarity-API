'use client'

import React, { FC, useEffect, useState } from 'react'
import Highlight, { defaultProps, type Language } from 'prism-react-renderer'
import darkTheme from 'prism-react-renderer/themes/nightOwl'
import lightTheme from 'prism-react-renderer/themes/nightOwlLight'
import { useTheme } from 'next-themes'

interface CodeProps {
	code: string
	show: boolean
	language: Language
	animationDelay?: number
	animated?: boolean
}

const Code: FC<CodeProps> = ({
	code,
	show,
	language,
	animationDelay,
	animated,
}) => {
	const { theme: applicationTheme } = useTheme()
	const [text, setText] = useState(animated ? '' : code)

	useEffect(() => {
		if (show && animated) {
			let i = 0
			setTimeout(() => {
				const intervalId = setInterval(() => {
					setText(code.slice(0, i))
					i++
					if (i > code.length) {
						clearInterval(intervalId)
					}
				}, 15)

				return () => clearInterval(intervalId)
			}, animationDelay || 150)
		}
	}, [code, show, animated, animationDelay])

	// calculate number of lines to determine the height
	const lines = text.split(/\r\n|\r|\n/).length

	const theme = applicationTheme === 'light' ? lightTheme : darkTheme

	return (
		<Highlight {...defaultProps} code={text} language={language} theme={theme}>
			{({ className, tokens, getLineProps, getTokenProps }) => (
				<pre
					className={
						className +
						'transition-all w-fit bg-transparent duration-100 py-0 no-scrollbar'
					}
					style={{ maxHeight: show ? lines * 24 : 0, opacity: show ? 1 : 0 }}
				>
					{tokens.map((line, idx) => {
						// eslint-disable-next-line no-unused-vars
						const { key, ...rest } = getLineProps({ line, key: idx })
						return (
							<div
								key={`line-${idx}`}
								style={{ position: 'relative' }}
								{...rest}
							>
								{line.map((token, index) => {
									// eslint-disable-next-line no-unused-vars
									const { key, ...props } = getTokenProps({ token, idx })
									return <span key={index} {...props}></span>
								})}
							</div>
						)
					})}
				</pre>
			)}
		</Highlight>
	)
}

export default Code