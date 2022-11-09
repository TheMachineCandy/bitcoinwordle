import { toast } from '@zerodevx/svelte-toast';

export const failure = (m: string) =>
	toast.push(m, {
		theme: {
			'--toastBackground': '#F56565',
			'--toastBarBackground': '#C53030',
			'--toastBorderRadius': '8px',
			'--toastMsgPadding': '1.0rem'
		}
	});
