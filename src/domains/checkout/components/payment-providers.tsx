// components/checkout/PaymentMethodSelector.tsx
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useGetPaymentProviders } from '@/services/-payment-providers-get';
import type { CheckoutFormValues } from '../checkout.schema';

interface PaymentMethodSelectorProps {
    value: CheckoutFormValues['paymentMethod'];
    onChange: (value: CheckoutFormValues['paymentMethod']) => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
    const { data: response, isLoading, error } = useGetPaymentProviders();
    const providers = response?.data ?? [];

    if (isLoading) {
        return <div className="mb-6">Loading payment methods...</div>;
    }

    if (error) {
        return (
            <div className="mb-6 text-destructive">
                Failed to load payment methods. Please refresh.
            </div>
        );
    }

    return (
        <div className="mb-6">
            <Label className="mb-3 block font-medium">Payment Method</Label>
            <RadioGroup
                value={value}
                onValueChange={(val) => onChange(val as CheckoutFormValues['paymentMethod'])}
                className="flex flex-wrap gap-4"
            >
                {providers.map((provider) => (
                    <Label
                        key={provider.name}
                        htmlFor={`payment-${provider.name}`}
                        className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 transition-colors ${value === provider.name ? 'border-accent bg-accent/5' : 'border-border'
                            }`}
                    >
                        <RadioGroupItem value={provider.name as string} id={`payment-${provider.name}`} />
                        <span>{provider.display_name}</span>
                        {provider.requires_card && (
                            <span className="ml-1 text-xs text-muted-foreground">(Card required)</span>
                        )}
                    </Label>
                ))}
            </RadioGroup>
        </div>
    );
}
