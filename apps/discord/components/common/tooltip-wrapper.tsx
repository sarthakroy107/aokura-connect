import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface IActionTooltipProps {
  children: React.ReactNode;
  label: string;
  side?: 'left' | 'right' | 'bottom' | 'top';
  align?: 'start' | 'end' | 'center';

}

const TooltipWrapper = ({ children, label, align, side }: IActionTooltipProps) => {

  return (
    <TooltipProvider>
      <Tooltip delayDuration={20}>
        <TooltipTrigger>
          {children}
        </TooltipTrigger>
        <TooltipContent align={align} side={side}>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default TooltipWrapper