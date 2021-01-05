import { IArea } from "../areas/base-area";
import supportedAreas from '../config/areas';

class AreaService {
    findArea(areaName: string): IArea | null {
        const area = supportedAreas.find((supportedArea) => {
            return supportedArea.acceptedValues.includes(areaName.toLowerCase().trim());
        });

        if (!area) {
            return null;
        }

        return new area.class;
    }

    getAllAreas(): Array<IArea> {
        return supportedAreas.map((supportedArea): IArea => {
            return new supportedArea.class;
        });
    }
}

export default AreaService;
