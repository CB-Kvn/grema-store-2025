/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'50': '#FBEDEC',
  				'100': '#F7DBD9',
  				'200': '#EFC0BD',
  				'300': '#E7A5A2',
  				'400': '#E08A86',
  				'500': '#E5ADA8',
  				'600': '#e3a0af',
  				'700': '#A3716C',
  				'800': '#82534E',
  				'900': '#613530',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			accent: {
  				'50': '#FBFAF9',
  				'100': '#F7F6F4',
  				'200': '#EFECEA',
  				'300': '#E7E3DF',
  				'400': '#E5E0D8',
  				'500': '#CEC9C2',
  				'600': '#B7B3AC',
  				'700': '#A09C96',
  				'800': '#898680',
  				'900': '#72706A',
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			rose: {
  				'50': '#FEEAF3',
  				'100': '#FDD5E7',
  				'200': '#FBAAD0',
  				'300': '#F97FBA',
  				'400': '#F754A3',
  				'500': '#DD0A77',
  				'600': '#C3096B',
  				'700': '#AA085F',
  				'800': '#910753',
  				'900': '#780647'
  			},
  			button: {
  				DEFAULT: '#E5ADA8',
  				hover: '#E7A5A2'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			serif: [
  				'Playfair Display',
  				'serif'
  			],
  			sans: [
  				'Inter',
  				'sans-serif'
  			]
  		},
  		keyframes: {
  			'fadeIn': {
  				'0%': {
  					opacity: 0,
  					transform: 'translateY(10px)'
  				},
  				'100%': {
  					opacity: 1,
  					transform: 'translateY(0)'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'slowBounce': {
  				'0%, 100%': {
  					transform: 'translateY(-10%)'
  				},
  				'50%': {
  					transform: 'translateY(0)'
  				}
  			},
  			'slowPulse': {
  				'0%, 100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				},
  				'50%': {
  					transform: 'scale(1.1)',
  					opacity: '0.9'
  				}
  			}
  		},
  		animation: {
  			'fadeIn': 'fadeIn 0.5s ease-in-out forwards',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'slow-bounce': 'bounce 100s infinite',
  			'slowPulse': 'slowPulse 150s infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
