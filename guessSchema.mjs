import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://apywlcxidcnpbqmectgn.supabase.co',
  'sb_publishable_l4yy6Yqvy-_cnNSurRCIIA_iF0aMvIV'
);

async function guessSchema() {
  const tableNames = ['routes', 'bus_routes', 'trips', 'buses', 'stops', 'route_stops', 'waypoints', 'locations', 'bus_info'];
  
  for (const table of tableNames) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (!error) {
      console.log(`✅ Table exists: ${table}`);
      if (data.length > 0) {
        console.log(`   Columns: ${Object.keys(data[0]).join(', ')}`);
        console.log(`   Sample:`, data[0]);
      } else {
        console.log(`   (Table is empty, cannot infer columns)`);
      }
    }
  }
}

guessSchema();
