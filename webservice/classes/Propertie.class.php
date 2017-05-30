<?php

/**
 * @author Alamo Pereira Saravali <alamo.saravali@gmail.com>
 * @application ConectaRenal
 * @description This is a WebService component to get data and send to ConectaRenal app requests
 */

require_once "APSDatabase.class.php";

class Propertie {
    private $connection;
    private $table = "properties";
    private $limit = 10;

    public $id_propertie;

    /**
     * CONSTRUCT
     */
    public function __construct ($id_propertie = null) {
        // Establish connection to Database
        $this->connection = new APSDatabase('PRODUCTION');

        if ($id_propertie) {
            $this->id_propertie = $id_propertie;
        }
    }

    /**
     * GET ALL
     * @param  integer $page [description]
     * @return [type]        [description]
     */
    public function getAll ($page = 1) {
        $this->connection->where('id_propertie >', 0);
        $this->connection->order_by('created_at', 'ASC');
        $this->connection->limit($this->limit);
        $this->connection->skip((($page - 1) * $this->limit));
        $result = $this->connection->select('*', $this->table);

        $properties = array();

        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $properties[] = $this->convertDBToApp($row);
            }
        }

        return $properties;
    }

    /**
     * GET
     * @return [type] [description]
     */
    public function get () {
        if (!$this->id_propertie) {
            return false;
        }
        else {
            $this->connection->where('id_propertie', $this->id_propertie);
            $this->connection->limit(1);
            $result = $this->connection->select('*', $this->table);

            if ($result && $result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    return $this->convertDBToApp($row);
                }
            }
            else {
                return false;
            }
        }
    }

    /**
     * CONVERT DB TO APP
     * @return [type] [description]
     */
    public function convertDBToApp ($row = array()) {
        $app_data =  array(
            'id_propertie' => $row['id_propertie'],
            'client' => array(
                'name' => $row['client_name'],
                'email' => $row['client_email'],
                'phone' => $row['client_phone'],
                'hide' => ($row['hide_client']) ? true : false,
            ),
            'realtors' => array(),
            'images' => array(),
            'propertie' => array(
                'title' => $row['title'],
                'description' => $row['description'],
                'street' => $row['street'],
                'number' => $row['number'],
                'complement' => $row['complement'],
                'neighborhood' => $row['neighborhood'],
                'city' => $row['city'],
                'state' => $row['state'],
                'zipcode' => $row['zipcode'],
                'format' => $this->getFormatSlugByID($row['format']),
                'type' => $this->getTypeSlugByID($row['type']),
                'm_util' => (float) $row['m_util'],
                'm_total' => (float) $row['m_total'],
                'bedrooms' => (int) $row['bedrooms'],
                'rooms' => (int) $row['rooms'],
                'kitchens' => (int) $row['kitchens'],
                'bathrooms' => (int) $row['bathrooms'],
                'suites' => (int) $row['suites'],
                'vacancies' => (int) $row['vacancies'],
                'washbasins' => (int) $row['washbasins'],
                'services_areas' => (int) $row['services_areas'],
                'housekeepers' => (int) $row['housekeepers'],
                'offices' => (int) $row['offices'],
                'grills' => (int) $row['grills'],
                'backyards' => (int) $row['backyards'],
                'closets' => (int) $row['closets'],
                'furnitures' => (int) $row['furnitures'],
                'edicules' => (int) $row['edicules'],
            ),
            'values' => array(
                'rental_value' => (float) $row['rental_value'],
                'sale_value' => (float) $row['sale_value'],
                'iptu_value' => (float) $row['iptu_value'],
            ),
            'near' => array(
                'subway' => ($row['subway']) ? true : false,
                'schools' => ($row['schools']) ? true : false,
                'bus_stations' => ($row['bus_stations']) ? true : false,
                'hospitals' => ($row['hospitals']) ? true : false,
                'markets' => ($row['markets']) ? true : false,
                'backeries' => ($row['backeries']) ? true : false,
                'airports' => ($row['airports']) ? true : false,
                'roads' => ($row['roads']) ? true : false,
                'shoppings' => ($row['shoppings']) ? true : false,
            ),
            'condominium' => array(
                'name' => $row['condominium_name'],
                'recreation_area' => ($row['recreation_area']) ? true : false,
                'party_room' => ($row['party_room']) ? true : false,
                'sport_court' => ($row['sport_court']) ? true : false,
                'gym' => ($row['gym']) ? true : false,
                'concierge' => ($row['concierge']) ? true : false,
                'steam_room' => ($row['steam_room']) ? true : false,
                'garden' => ($row['garden']) ? true : false,
                'laundry' => ($row['laundry']) ? true : false,
                'balcony' => ($row['balcony']) ? true : false,
                'pool' => ($row['pool']) ? true : false,
                'gourmet' => ($row['gourmet']) ? true : false,
                'cold_floor' => ($row['cold_floor']) ? true : false,
                'laminate_floor' => ($row['laminate_floor']) ? true : false,
                'porcelain_floor' => ($row['porcelain_floor']) ? true : false,
                'wood_floor' => ($row['wood_floor']) ? true : false,
                'large_airy' => ($row['large_airy']) ? true : false,
                'great_location' => ($row['great_location']) ? true : false,
                'big_comfy' => ($row['big_comfy']) ? true : false,
                'new' => ($row['new']) ? true : false,
                'good_lighting' => ($row['good_lighting']) ? true : false,
            ),
            'publish' => array(
                'imovelweb' => ($row['publish_imovelweb']) ? true : false,
                'olx' => ($row['publish_olx']) ? true : false,
                'zapimoveis' => ($row['publish_zapimoveis']) ? true : false,
                'vivareal' => ($row['publish_vivareal']) ? true : false,
            ),
        );
    
        // realtors
        if ($row['realtors_ids']) {
            if (strstr($row['realtors_ids'], '|')) {
                $array_realtors = explode('|', $row['realtors_ids']);

                foreach ($array_realtors as $id_realtor) {
                    if ($id_realtor) {
                        $app_data['realtors'][$id_realtor] = true;
                    }
                }
            }
            else {
                $app_data['realtors'][$row['realtors_ids']] = true;
            }
        }

        // images
        if ($row['images_ids']) {
            if (strstr($row['images_ids'], '|')) {
                $array_images = explode('|', $row['images_ids']);

                foreach ($array_images as $id_image) {
                    if ($id_image) {
                        $app_data['images'][] = $this->getImageByID($id_image);
                    }
                }
            }
            else {
                $app_data['images'][] = $this->getImageByID($row['images_ids']);
            }
        }

        // echo '<pre>';
        // print_r($app_data);
        // var_dump($row['images_ids']);
        // echo '<br>';
        // echo '</pre>';

        // return app data
        return $app_data;
    }

    /**
     * SAVE PROPERTIE
     * @param  array   $data    [description]
     * @param  integer $id_user [description]
     * @return [type]           [description]
     */
    public function save ($data = array(), $id_user = 0) {
        // convert app data to db data
        $propertie_data = array(
            'client_name' => $data['client']['name'],
            'client_email' => $data['client']['email'],
            'client_phone' => $data['client']['phone'],
            'hide_client' => ($data['client']['hide'] == 'true') ? 1 : 0,

            'format' => $this->getFormatIDBySlug($data['propertie']['format']),
            'type' => $this->getTypeIDBySlug($data['propertie']['type']),
            
            'title' => $data['propertie']['title'],
            'description' => $data['propertie']['description'],
            'street' => $data['propertie']['street'],
            'number' => $data['propertie']['number'],
            'complement' => $data['propertie']['complement'],
            'neighborhood' => $data['propertie']['neighborhood'],
            'city' => $data['propertie']['city'],
            'state' => $data['propertie']['state'],
            'zipcode' => $data['propertie']['zipcode'],
            
            'm_util' => $data['propertie']['m_util'],
            'm_total' => $data['propertie']['m_total'],

            'bedrooms' => $data['propertie']['bedrooms'],
            'rooms' => $data['propertie']['rooms'],
            'kitchens' => $data['propertie']['kitchens'],
            'bathrooms' => $data['propertie']['bathrooms'],
            'suites' => $data['propertie']['suites'],
            'vacancies' => $data['propertie']['vacancies'],
            'washbasins' => $data['propertie']['washbasins'],
            'services_areas' => $data['propertie']['services_areas'],
            'housekeepers' => $data['propertie']['housekeepers'],
            'offices' => $data['propertie']['offices'],
            'grills' => $data['propertie']['grills'],
            'backyards' => $data['propertie']['backyards'],
            'closets' => $data['propertie']['closets'],
            'furnitures' => $data['propertie']['furnitures'],
            'edicules' => $data['propertie']['edicules'],

            'rental_value' => $data['values']['rental_value'],
            'sale_value' => $data['values']['sale_value'],
            'iptu_value' => $data['values']['iptu_value'],

            'subway' => ($data['near']['subway'] == 'true') ? 1 : 0,
            'schools' => ($data['near']['schools'] == 'true') ? 1 : 0,
            'bus_stations' => ($data['near']['bus_stations'] == 'true') ? 1 : 0,
            'hospitals' => ($data['near']['hospitals'] == 'true') ? 1 : 0,
            'markets' => ($data['near']['markets'] == 'true') ? 1 : 0,
            'backeries' => ($data['near']['backeries'] == 'true') ? 1 : 0,
            'airports' => ($data['near']['airports'] == 'true') ? 1 : 0,
            'roads' => ($data['near']['roads'] == 'true') ? 1 : 0,
            'shoppings' => ($data['near']['shoppings'] == 'true') ? 1 : 0,

            'condominium_name' => $data['condominium']['name'],

            'recreation_area' => ($data['condominium']['recreation_area'] == 'true') ? 1 : 0,
            'party_room' => ($data['condominium']['party_room'] == 'true') ? 1 : 0,
            'sport_court' => ($data['condominium']['sport_court'] == 'true') ? 1 : 0,
            'gym' => ($data['condominium']['gym'] == 'true') ? 1 : 0,
            'concierge' => ($data['condominium']['concierge'] == 'true') ? 1 : 0,
            'steam_room' => ($data['condominium']['steam_room'] == 'true') ? 1 : 0,
            'garden' => ($data['condominium']['garden'] == 'true') ? 1 : 0,
            'laundry' => ($data['condominium']['laundry'] == 'true') ? 1 : 0,
            'balcony' => ($data['condominium']['balcony'] == 'true') ? 1 : 0,
            'pool' => ($data['condominium']['pool'] == 'true') ? 1 : 0,
            'gourmet' => ($data['condominium']['gourmet'] == 'true') ? 1 : 0,
            'cold_floor' => ($data['condominium']['cold_floor'] == 'true') ? 1 : 0,
            'laminate_floor' => ($data['condominium']['laminate_floor'] == 'true') ? 1 : 0,
            'porcelain_floor' => ($data['condominium']['porcelain_floor'] == 'true') ? 1 : 0,
            'wood_floor' => ($data['condominium']['wood_floor'] == 'true') ? 1 : 0,
            'large_airy' => ($data['condominium']['large_airy'] == 'true') ? 1 : 0,
            'great_location' => ($data['condominium']['great_location'] == 'true') ? 1 : 0,
            'big_comfy' => ($data['condominium']['big_comfy'] == 'true') ? 1 : 0,
            'new' => ($data['condominium']['new'] == 'true') ? 1 : 0,
            'good_lighting' => ($data['condominium']['good_lighting'] == 'true') ? 1 : 0,

            'publish_imovelweb' => ($data['publish']['imovelweb'] == 'true') ? 1 : 0,
            'publish_olx' => ($data['publish']['olx'] == 'true') ? 1 : 0,
            'publish_zapimoveis' => ($data['publish']['zapimoveis'] == 'true') ? 1 : 0,
            'publish_vivareal' => ($data['publish']['vivareal'] == 'true') ? 1 : 0,

            'realtors_ids' => implode('|', array_keys($data['realtors'])), 
        );

        if (!$this->id_propertie) {
            $propertie_data['id_user'] = $id_user;
            $propertie_data['status'] = 1;
            $propertie_data['created_at'] = date('Y-m-d H:i:s');

            $inserted = $this->connection->insert($this->table, $propertie_data);

            if ($inserted) {
                // get id
                $this->id_propertie = $this->connection->get_last_insert_id();

                // save images
                if (isset($data['images']) && $data['images']) {
                    $this->saveImages($data['images']);
                }

                return 1;
            }
            else {
                return 0;
            }
        }
        else {
            $propertie_data['updated_at'] = date('Y-m-d H:i:s');

            $this->connection->where('id_propertie', $this->id_propertie);
            $updated = $this->connection->update($this->table, $propertie_data);

            if ($updated) {
                // save images
                if (isset($data['images']) && $data['images']) {
                    $this->saveImages($data['images']);
                }

                return 1;
            }
            else {
                return 0;
            }
        }
    }

    /**
     * SAVE IMAGES
     * @param  array  $images [description]
     * @return [type]         [description]
     */
    public function saveImages ($images = array()) {
        $images_ids = array();
        foreach ($images as $key => $image) {
            $filename = $this->id_propertie . '_' . $key . '.jpg';

            // $data = base64_decode($image['base64']);

            $this->connection->where('filename', $filename);
            $this->connection->where('id_propertie', $this->id_propertie);
            $result = $this->connection->select('id_image', 'images');

            if ($result && $result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    // update
                    $this->connection->where('filename', $filename);
                    $this->connection->where('id_propertie', $this->id_propertie);
                    $this->connection->update('images', array(
                        'base64' => $image['base64'],
                    ));

                    $images_ids[] = $row['id_image'];
                    break;
                }
            }
            else {
                $this->connection->insert('images', array(
                    'id_propertie' => $this->id_propertie,
                    'filename' => $filename,
                    'base64' => $image['base64'],
                ));

                $images_ids[] = $this->connection->get_last_insert_id();
            }
        }

        $this->connection->where('id_propertie', $this->id_propertie);
        $this->connection->update($this->table, array(
            'images_ids' => implode('|', $images_ids),
        ));
    }

    /**
     * GET FORMAT ID BY SLUG
     * @param  string $slug [description]
     * @return [type]       [description]
     */
    public function getFormatIDBySlug ($slug = '') {
        $this->connection->where('slug', $slug);
        $result = $this->connection->select('id_format', 'formats');

        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                return $row['id_format'];
            }
        }
        else {
            return NULL;
        }
    }

    /**
     * GET FORMAT SLUG BY ID
     * @param  string $id_format [description]
     * @return [type]       [description]
     */
    public function getFormatSlugByID ($id_format = '') {
        $this->connection->where('id_format', $id_format);
        $result = $this->connection->select('slug', 'formats');

        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                return $row['slug'];
            }
        }
        else {
            return NULL;
        }
    }

    /**
     * GET TYPE ID BY SLUG
     * @param  string $slug [description]
     * @return [type]       [description]
     */
    public function getTypeIDBySlug ($slug = '') {
        $this->connection->where('slug', $slug);
        $result = $this->connection->select('id_type', 'types');

        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                return $row['id_type'];
            }
        }
        else {
            return NULL;
        }
    }

    /**
     * GET FORMAT SLUG BY ID
     * @param  string $id_type [description]
     * @return [type]       [description]
     */
    public function getTypeSlugByID ($id_type = '') {
        $this->connection->where('id_type', $id_type);
        $result = $this->connection->select('slug', 'types');

        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                return $row['slug'];
            }
        }
        else {
            return NULL;
        }
    }

    /**
     * GET IMAGE BY ID
     * @param  integer $id_image [description]
     * @return [type]            [description]
     */
    public function getImageByID ($id_image = 0) {
        $this->connection->where('id_image', $id_image);
        $result = $this->connection->select('base64', 'images');

        if ($result && $result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $image = array(
                    'base64' => $row['base64'],
                );

                // if (file_exists('./images/' . $row['filename'])) {
                //     $image['base64'] = base64_encode(file_get_contents('./images/' . $row['filename']));
                // }
                break;
            }

            return $image;
        }

        return null;
    }

    /**
     * REMOVE
     * @return [type] [description]
     */
    public function remove () {
        if (!$this->id_propertie) {
            return false;
        }
        else {
            $this->connection->where('id_propertie', $this->id_propertie);
            return $this->connection->delete('properties');
        }
    }
}