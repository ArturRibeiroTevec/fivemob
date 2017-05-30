<?php

/**
 * @author Alamo Pereira Saravali <alamo.saravali@gmail.com>
 * @application ConectaRenal
 * @description This is a WebService component to get data and send to ConectaRenal app requests
 */

require_once "APSDatabase.class.php";

class User
{

	private $connection;
	private $table = "users";
	private $password_protection = 'F1UM03';

	/*
	USER INFO
	 */
	public $id_user;
	public $name;
	public $email;
	public $password;
	public $created_at;
	public $admin;
	public $realtor;

	/**
	 * TOKEN
	 */
	public $token;


	/**
	 * CONSTRUCT
	 * Establish Database connection
	 */
	public function __construct ()
	{
		// Establish connection to Database
		$this->connection = new APSDatabase('PRODUCTION');
	}

	/**
	 * GET SESSAO
	 * @param  [type] $token [description]
	 * @return [type]        [description]
	 */
	public function getSession ($token) {
		if ($token) {
			$this->connection->where('token', $token);
			$this->connection->limit(1);
			$result = $this->connection->select('*', 'sessions');

			if ($result && $result->num_rows > 0) {
				while ($row = $result->fetch_assoc()) {
					return $row;
				}
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}
	}

	/**
	 * IS ADMIN?
	 * @param  string  $id_user [description]
	 * @return boolean          [description]
	 */
	public function is_admin ($id_user = '') {
		if (!$id_user) {
			return false;
		}
		else {
			$this->connection->where('id_user', $id_user);
			$result = $this->connection->select('admin', $this->table);

			if ($result && $result->num_rows > 0) {
				$response = false;

				while($row = $result->fetch_assoc()) {
					if ($row['admin']) {
						$response = true;
					}
					else {
						$response = false;
					}
					break;
				}

				return $response;
			}
			else {
				return false;
			}
		}
	}

	/**
	 * DO LOGIN
	 * @param  [type] $email [description]
	 * @param  [type] $password [description]
	 * @return [type]           [description]
	 */
	public function doLogin ($email = null, $password = null) {
		$email = addslashes($email);
		$password = addslashes($password);

		if (!$email || !$password) {
			return array(
				'status' => '0',
				'message' => 'Por favor, insira seus dados para logar.',
			);
		}
		else if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
			$this->connection->where('email', $email);
			$this->connection->where('password', sha1($password . $this->password_protection));
			$this->connection->limit(1);
			$result = $this->connection->select('*', $this->table);

			if (!$result || $result->num_rows <= 0) {
				return array(
					'status' => '0',
					'message' => 'Ops! Não encontramos nenhum registro com este Email e Senha.',
				);
			}
			else {
				while ($row = $result->fetch_assoc()) {
					// convert db data
					$this->convertDBData($row);
				}

				// generate token
				$this->generateSessionToken();

				return array(
					'status' => '1',
					'user' => $this->getArray(),
					'token' => $this->token,
				);
			}
		}
		else {
			return array(
				'status' => '0',
				'message' => 'Ops! Por favor, insira um e-mail válido.',
			);
		}
	}

	/**
	 * GERAR TOKEN SESSAO
	 * @return [type] [description]
	 */
	public function generateSessionToken () {
		// gera novo token
		$this->token = sha1($this->id_user . $this->email . $this->password . date('Y-m-d_H:i:s'));

		// salva novo token
		$this->connection->insert('sessions', array(
			'id_user' => $this->id_user,
			'token' => $this->token,
			'login_at' => date('Y-m-d H:i:s'),
		));
	}


	/**
	 * DO REGISTER
	 * @param  string $name     [description]
	 * @param  string $email    [description]
	 * @param  string $password [description]
	 * @param  string $admin    [description]
	 * @param  string $realtor  [description]
	 * @return [type]           [description]
	 */
	public function doRegister ($name = '', $email = '', $password = '', $admin = 0, $realtor = 0) {

		// verify if is a valid email
		if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
			return array(
				'status' => '0',
				'message' => 'Por favor, insira um e-mail válido.'
			);
		}
		else if ($this->existsEmail($email)) {
			return array(
				'status' => '0',
				'message' => 'Ops! Já existe um registro com este e-mail.'
			);
		}
		else {
			$this->name = $this->retiraEspacos($name);
			$this->email = $this->retiraAcentos($this->retiraEspacos($email));
			$this->password = sha1($password . $this->password_protection);
			$this->admin = ($admin == 'true') ? 1 : 0;
			$this->realtor = ($realtor == 'true') ? 1 : 0;
			$this->created_at = date('Y-m-d H:i:s');

			$dataToInsert = array(
				'name' => $this->name,
				'email' => $this->email,
				'password' => $this->password,
				'admin' => $this->admin,
				'realtor' => $this->realtor,
				'created_at' => $this->created_at,
			);

			// insert
			$inserted = $this->connection->insert($this->table, $dataToInsert);

			if ($inserted) {
				// get id
				// $this->id_user = $this->connection->get_last_insert_id();

				// return user
				return array(
					'status' => '1',
				);
			}
			else {
				return array(
					'status' => '0',
					'message' => 'Ops! Ocorreu um erro com o registro. Por favor, tente novamente.'
				);
			}
		}
	}

	/**
	 * UPDATE
	 * @param  [type] $params [description]
	 * @return [type]         [description]
	 */
	public function update ($id_user = 0, $name = '', $email = '', $password = '', $admin = 0, $realtor = 0) {
		$this->name = $this->retiraEspacos($name);
		$this->email = $this->retiraAcentos($this->retiraEspacos($email));
		$this->admin = ($admin == 'true') ? 1 : 0;
		$this->realtor = ($realtor == 'true') ? 1 : 0;

		$dataToUpdate = array(
			'name' => $this->name,
			'email' => $this->email,
			'admin' => $this->admin,
			'realtor' => $this->realtor,
		);

		if ($password) {
			$this->password = sha1($password . $this->password_protection);
			$dataToUpdate['password'] = $this->password;
		}

		// atualiza os dados do usuario
		$this->connection->where('id_user', $id_user);
		$updated = $this->connection->update($this->table, $dataToUpdate);

		if ($updated) {
			return array(
				'status' => '1',
			);
		}
		else {
			return array(
				'status' => '0',
				'message' => 'Ops! Ocorreu um erro durante a atualização de seus dados. Por favor, tente novamente. Caso o erro persista, entre em contato conosco.'
			);
		}
	}

	/**
	 * DO LOGOUT
	 * @param  [type] $token         [description]
	 * @return [type]                 [description]
	 */
	public function doLogout ($token) {
		// cancela session
		$this->connection->where('token', $token);
		$this->connection->delete('sessions');
	}

	/**
	 * VERIFY IF EXISTS EMAIL
	 * @param  [type] $email [description]
	 * @return [type]        [description]
	 */
	public function existsEmail ($email) {
		$this->connection->where('email', $email);
		$this->connection->limit(1);
		$result = $this->connection->select('id_user', $this->table);

		if ($result && $result->num_rows > 0) {
			return true;
		}
		else {
			return false;
		}
	}



	/**
	 * SLUGIFY
	 * @param  [type] $text [description]
	 * @return [type]       [description]
	 */
	public function slugify($text)
	{
		$array1 = array(
			"á", "à", "â", "ã", "ä", "é", "è", "ê", "ë", "í", "ì", "î", "ï",
			"ó", "ò", "ô", "õ", "ö", "ú", "ù", "û", "ü", "ç","Á", "À", "Â",
			"Ã", "Ä", "É", "È", "Ê", "Ë", "Í", "Ì", "Î", "Ï", "Ó", "Ò", "Ô",
			"Õ", "Ö", "Ú", "Ù", "Û", "Ü", "Ç"
			);
		$array2 = array(
			"a", "a", "a", "a", "a", "e", "e", "e", "e", "i", "i", "i", "i",
			"o", "o", "o", "o", "o", "u", "u", "u", "u", "c", "A", "A", "A",
			"A", "A", "E", "E", "E", "E", "I", "I", "I", "I", "O", "O", "O",
			"O", "O", "U", "U", "U", "U", "C"
			);

		// retira acentos
		$text = str_replace($array1, $array2, $text);

		// retira ' e "
		$test = str_replace(array('"', "'"), '', $text);

    	// replace non letter or digits by -
		$text = preg_replace('~[^\\pL\d]+~u', '-', $text);

    	// trim
		$text = trim($text, '-');

   		// transliterate
		$text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);

   	 	// lowercase
		$text = strtolower($text);

    	// remove unwanted characters
		$text = preg_replace('~[^-\w]+~', '', $text);

		if (empty($text))
		{
			return 'n-a';
		}

		return $text;
	}

	/**
	 * RETIRA ACENTOS
	 * @param  [type] $text [description]
	 * @return [type]       [description]
	 */
	public function retiraAcentos ($text) {
		$array1 = array(
			"á", "à", "â", "ã", "ä", "é", "è", "ê", "ë", "í", "ì", "î", "ï",
			"ó", "ò", "ô", "õ", "ö", "ú", "ù", "û", "ü", "ç","Á", "À", "Â",
			"Ã", "Ä", "É", "È", "Ê", "Ë", "Í", "Ì", "Î", "Ï", "Ó", "Ò", "Ô",
			"Õ", "Ö", "Ú", "Ù", "Û", "Ü", "Ç"
			);
		$array2 = array(
			"a", "a", "a", "a", "a", "e", "e", "e", "e", "i", "i", "i", "i",
			"o", "o", "o", "o", "o", "u", "u", "u", "u", "c", "A", "A", "A",
			"A", "A", "E", "E", "E", "E", "I", "I", "I", "I", "O", "O", "O",
			"O", "O", "U", "U", "U", "U", "C"
			);

		// retira acentos
		return str_replace($array1, $array2, $text);
	}

	/**
	 * RETIRA ESPACOS
	 * @param  [type] $text [description]
	 * @return [type]       [description]
	 */
	public function retiraEspacos ($text) {
		return str_replace('  ', ' ', trim($text));
	}


	/**
	 * GET DATA
	 */

	/**
	 * [getArray function to get user data Array]
	 * @return [array] [array with all user attributes]
	 */
	public function getArray ()
	{
		// Build User Array with User Data
		$user_array = array(
			'id_user' => $this->id_user,
			'name' => $this->name,
			'email' => $this->email,
			'admin' => $this->admin,
			'realtor' => $this->realtor,
		);

		// Return User Array
		return $user_array;
	}

	/**
	 * [getJSON function to get JSON String enconded with User Data]
	 * @return [JSON String encoded] [array converted to JSON String encoded]
	 */
	public function getJSON ()
	{
		// Return User Array converted to JSON String encoded
		return json_encode($this->getArray());
	}


	/**
	 * FIND
	 */

	/**
	 * [findById find user by his ID and add attrs to variable]
	 * @param  [int] $id [user id]
	 * @return [bool] [true or false if find user or not]
	 */
	public function findById ($id)
	{
		// Verify if $id is valid
		if ($id)
		{
			// Search user by id in database
			$this->connection->where('id_user', $id);

			// limit in one
			$this->connection->limit(1);

			// Select query
			$result = $this->connection->select('*', $this->table);

			if ($result && $result->num_rows > 0)
			{
				// Attribute keys to variables
				while ($row = $result->fetch_assoc())
				{
					// convert db data
					$this->convertDBData($row);
				}

				return true;
			}
			else
			{
				return false;
			}
		}
		else
		{
			return false;
		}
	}

	/**
	 * [findByEmail find user by his ID and add attrs to variable]
	 * @param  [int] $email [user email]
	 * @return [bool] [true or false if find user or not]
	 */
	public function findByEmail ($email)
	{
		// Verify if $email is valid
		if ($email)
		{
			// Search user by id in database
			$this->connection->where('email', $email);

			// Select query
			$result = $this->connection->select('*', $this->table);

			if ($result && $result->num_rows > 0)
			{
				// Attribute keys to variables
				while ($row = $result->fetch_assoc())
				{
					// convert db data
					$this->convertDBData($row);
				}

				return true;
			}
			else
			{
				return false;
			}
		}
		else
		{
			return false;
		}
	}

	/**
	 * FIND BY SESSION
	 * @param  [type] $token [description]
	 * @return [type]        [description]
	 */
	public function findBySession ($token) {
		// verifica o token
		if ($token) {
			// get session
			$session = $this->getSession($token);

			// verifica a session
			if ($session) {
				return $this->findById($session['id_user']);
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}
	}

	/**
	 * GET ALL
	 * @return [type] [description]
	 */
	public function getAll () {
		$this->connection->where('realtor', 1);
		$result = $this->connection->select('*', $this->table);

		if ($result && $result->num_rows > 0) {
			$realtors = array();

			// Attribute keys to variables
			while ($row = $result->fetch_assoc()) {
				// convert db data
				$this->convertDBData($row);

				// get array data
				$realtors[] = $this->getArray();
			}

			return $realtors;
		}
		else {
			return array();
		}
	}

	/**
	 * GET ACCOUNTS
	 * @return [type] [description]
	 */
	public function getAccounts ($id_user)
	{
		// 1) get account types
		$result_types = $this->connection->select('*', 'account_types');

		if ($result_types && $result_types->num_rows > 0) {
			$accounts = array();

			// Attribute keys to variables
			while ($type = $result_types->fetch_assoc()) {
				$this->connection->where('id_user', $id_user);
				$this->connection->where('status', 1);
				$this->connection->where('id_type', $type['id_type']);
				$this->connection->order_by('id_account', 'DESC');
				$this->connection->limit(1);
				$result = $this->connection->select('*', 'accounts');

				if ($result && $result->num_rows > 0) {
					while($account = $result->fetch_assoc()) {
						$account_keys = array_keys($account);
						foreach($account_keys as $key) {
							$type[$key] = $account[$key];
						}
						break;
					}
				}

				// add to accounts
				$accounts[] = $type;
			}

			return $accounts;
		}
		else {
			return array();
		}
	}

	/**
	 * CONVERT DATABASE DATA
	 * @param  [type] $row [description]
	 * @return [type]       [description]
	 */
	public function convertDBData ($row) {
		$this->id_user = $row['id_user'];
		$this->name = $row['name'];
		$this->email = $row['email'];
		$this->admin = ($row['admin']) ? true : false;
		$this->realtor = ($row['realtor']) ? true : false;
		$this->created_at = date('d/m/Y H:i:s', strtotime($row['created_at']));
	}
}
