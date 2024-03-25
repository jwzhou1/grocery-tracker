import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';


// Function to determine the icon based on category
function getIconName(category) {
  switch (category) {
    case 'Vegetables':
      return <MaterialIcons name="local-grocery-store" size={26} color="black" />;
    case 'Fruits':
      return <MaterialIcons name="local-grocery-store" size={26} color="black" />;
    case 'Dairy':
      return <MaterialIcons name="local-grocery-store" size={26} color="black" />;
    case 'Beverages':
      return <MaterialIcons name="local-grocery-store" size={26} color="black" />;
    case 'Meat':
      return <MaterialIcons name="local-grocery-store" size={26} color="black" />;
    case 'Snacks':
      return <MaterialIcons name="local-grocery-store" size={26} color="black" />;
    case 'Canned Goods':
      return <MaterialIcons name="local-grocery-store" size={26} color="black" />;
    case 'Frozen Foods':
      return <MaterialIcons name="local-grocery-store" size={26} color="black" />;
    default:
      return <MaterialIcons name="local-grocery-store" size={26} color="black" />;
  }
}

export default getIconName;
