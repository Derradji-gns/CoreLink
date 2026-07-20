import ChartAreaInteractive from "@/components/chart-area-interactive"
import SectionCards from "@/components/charts"

export default function Statistics() {

    return (
        <div className="">
              <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-4 gap-4 m-6 py-4 md:gap-6 md:py-6">
              <SectionCards/>
              <SectionCards/>
              <SectionCards/>
              <SectionCards/>
              </div>
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>

            </div>
          </div>
        </div>   
                
    )
    
}