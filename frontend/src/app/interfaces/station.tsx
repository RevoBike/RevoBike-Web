export interface Station {
  _id: string;
  name: string;
  address: string;
  available_bikes: [];
  createdAt: string;
  updatedAt: string;
  totalSlots: number;
  location: {
    coordinates: number[];
  };
}
export interface FormValues {
  name: string;
  address: string;
  capacity: number;
  location: number[];
}

export interface UpdateFormValues {
  name: string;
  address: string;
  capacity: number;
  location: number[] | null;
}

export interface HandleSubmitProps {
  (values: FormValues): void;
}

export interface EditStationModalProps {
  opened: boolean;
  onClose: () => void;
  station: Station;
}

export interface AddStationModalProps {
  opened: boolean;
  onClose: () => void;
}
